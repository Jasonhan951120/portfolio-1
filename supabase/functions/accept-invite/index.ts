import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { token, user_id, user_email, full_name } = await req.json();

    if (!token || !user_id) {
      return new Response(JSON.stringify({ error: "Missing token or user_id" }), { status: 400 });
    }

    // Initialize Supabase with the service role key to bypass RLS for token validation
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Verify the token exists and is pending
    const { data: invite, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) {
      return new Response(JSON.stringify({ error: "Invalid or expired invitation token." }), { status: 400 });
    }

    // Check expiration
    if (new Date(invite.expires_at) < new Date()) {
      await supabase.from('invitations').update({ status: 'expired' }).eq('id', invite.id);
      return new Response(JSON.stringify({ error: "This invitation has expired." }), { status: 400 });
    }

    // Verify email matches (optional, but good for security)
    if (invite.email.toLowerCase() !== user_email.toLowerCase()) {
      return new Response(JSON.stringify({ error: "The provided email does not match the invitation." }), { status: 400 });
    }

    // 2. Add or Update the Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user_id,
        clinic_id: invite.clinic_id,
        role: invite.role,
        full_name: full_name || user_email.split('@')[0],
        email: user_email,
        is_admin: invite.role === 'admin'
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      throw profileError;
    }

    // 3. Mark the invitation as accepted
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    if (updateError) {
      console.error("Failed to update invitation status:", updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true, message: "Invitation accepted successfully." }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: any) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
});
