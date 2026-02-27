import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "admin@londonsmiledental.com";
const FROM = "onboarding@resend.dev"; // Use verified domain in production

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
    const { name, email, phone, service, notes } = await req.json();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
    }

    // 1. Alert admin
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `London Smile Dental <${FROM}>`,
        to: [ADMIN_EMAIL],
        subject: `🦷 New Patient Enquiry — ${name} (${service})`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:12px;">
            <h2 style="color:#1a1a2e;margin-bottom:4px;">⚡ New Consultation Request</h2>
            <p style="color:#e74c3c;font-weight:bold;margin-top:0;">👆 Call within 5 minutes for best results!</p>
            <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;">
              <tr style="background:#f1f5f9;"><td style="padding:12px;font-weight:bold;width:30%;">Name</td><td style="padding:12px;">${name}</td></tr>
              <tr><td style="padding:12px;font-weight:bold;">Phone</td><td style="padding:12px;"><a href="tel:${phone}" style="color:#1a1a2e;font-weight:bold;">${phone}</a></td></tr>
              <tr style="background:#f1f5f9;"><td style="padding:12px;font-weight:bold;">Email</td><td style="padding:12px;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:12px;font-weight:bold;">Treatment</td><td style="padding:12px;">${service}</td></tr>
              <tr style="background:#f1f5f9;"><td style="padding:12px;font-weight:bold;">Notes</td><td style="padding:12px;">${notes || "—"}</td></tr>
            </table>
            <p style="margin-top:20px;text-align:center;">
              <a href="https://tpzdercbacefqfpadhcb.supabase.co" 
                 style="display:inline-block;padding:12px 28px;background:#1a1a2e;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
                View Dashboard →
              </a>
            </p>
          </div>
        `,
      }),
    });

    if (!adminRes.ok) {
      const err = await adminRes.text();
      console.error("Admin email error:", err);
    }

    // 2. Thank-you email to patient (with dynamic content)
    let dynamicContent = `
          <p style="color:#555;line-height:1.6;">
            We've received your enquiry about <strong>${service}</strong>. 
            Our team will be in touch within <strong>24 hours</strong> to arrange your consultation.
          </p>
        `;

    if (service === "Dental Implants") {
      dynamicContent += `
            <div style="background:#f8fafc;padding:20px;border-radius:12px;margin:20px 0;border-left:4px solid #1a1a2e;">
              <h4 style="margin:0 0 10px 0;color:#1a1a2e;">🔬 Why Choose Us for Implants?</h4>
              <p style="margin:0;font-size:14px;color:#555;">We use Swiss-grade titanium and 3D digital mapping for 99% accuracy and minimal discomfort.</p>
            </div>
          `;
    } else if (service === "Teeth Whitening") {
      dynamicContent += `
            <div style="background:#fffbeb;padding:20px;border-radius:12px;margin:20px 0;border-left:4px solid #d97706;">
              <h4 style="margin:0 0 10px 0;color:#92400e;">✨ Instant Results</h4>
              <p style="margin:0;font-size:14px;color:#92400e;">Our "Enlighten" system guarantees B1 shade (the naturally whitest shade possible) with zero sensitivity.</p>
            </div>
          `;
    }

    const patientRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `London Smile Dental <${FROM}>`,
        to: [email],
        subject: `Your ${service} enquiry — London Smile ✨`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333;">
            <h2 style="color:#1a1a2e;">Thank you, ${name}! 🦷</h2>
            ${dynamicContent}
            <p style="color:#555;line-height:1.6;">
              While you wait, see transformed smiles like yours:
            </p>
            <p style="text-align:center;margin:24px 0;">
              <a href="https://london-smile-dental.vercel.app/results"
                 style="display:inline-block;padding:14px 32px;background:#1a1a2e;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
                View Real Patient Results →
              </a>
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
            <table style="width:100%;">
              <tr>
                <td style="font-size:12px;color:#888;">
                  <strong>London Smile Dental</strong><br/>
                  123 Harley Street, London W1G 6AB<br/>
                  📞 020 7123 4567
                </td>
                <td style="text-align:right;">
                  <span style="font-size:24px;">⭐⭐⭐⭐⭐</span><br/>
                  <span style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;">London's Highest Rated Clinical Team</span>
                </td>
              </tr>
            </table>
          </div>
        `,
      }),
    });


    if (!patientRes.ok) {
      const err = await patientRes.text();
      console.error("Patient email error:", err);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
});
