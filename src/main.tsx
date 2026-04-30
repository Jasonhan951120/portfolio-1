import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <GoogleOAuthProvider clientId={googleClientId || ""}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>,
  );
} else {
  document.body.innerHTML = `
    <div style="min-height:100vh;background:#0A0A0B;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;padding:20px;">
      <div style="max-width:500px;width:100%;text-align:center;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:40px;border-radius:24px;">
        <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;color:#D4AF37;">SYSTEM INTEGRITY INTERRUPTED</h1>
        <p style="color:rgba(255,255,255,0.6);margin-bottom:32px;line-height:1.6;">A localized runtime conflict has been detected. Restoring the 'Clean Slate' configuration will resolve persistent session corruption.</p>
        <button onclick="localStorage.clear();sessionStorage.clear();window.location.reload();" style="background:#D4AF37;color:black;border:none;padding:16px 32px;border-radius:12px;font-weight:700;cursor:pointer;">
          RESTORE SYSTEM INTEGRITY
        </button>
      </div>
    </div>
  `;
}
