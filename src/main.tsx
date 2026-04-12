import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("BOOTSTRAP: main.tsx starting");
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("FATAL: Root element not found");
  } else {
    createRoot(rootElement).render(
      <StrictMode>
        <GoogleOAuthProvider clientId={googleClientId || "missing-client-id"}>
          <App />
        </GoogleOAuthProvider>
      </StrictMode>,
    );
  }
} catch (e) {
  console.error("BOOTSTRAP ERROR:", e);
  
  // High-Fidelity Medical Emergency Fallback UI
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-h-screen; background: #0A0A0B; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div style="max-width: 500px; width: 100%; text-align: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 24px;">
          <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #D4AF37;">SYSTEM INTEGRITY INTERRUPTED</h1>
          <p style="color: rgba(255,255,255,0.6); margin-bottom: 32px; line-height: 1.6;">A localized runtime conflict has been detected. Restoring the 'Clean Slate' configuration will resolve persistent session corruption.</p>
          <button 
            onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();"
            style="background: #D4AF37; color: black; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;"
          >
            RESTORE SYSTEM INTEGRITY
          </button>
          <p style="margin-top: 24px; font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; text-transform: uppercase;">Medical Concierge Recovery Protocol 4.2</p>
        </div>
      </div>
    `;
  }
}
