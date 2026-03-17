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
    console.log("BOOTSTRAP: Root element found, mounting React");
    createRoot(rootElement).render(
      <StrictMode>
        <GoogleOAuthProvider clientId={googleClientId || "missing-client-id"}>
          <App />
        </GoogleOAuthProvider>
      </StrictMode>,
    );
    console.log("BOOTSTRAP: Render called");
  }
} catch (e) {
  console.error("BOOTSTRAP ERROR:", e);
}
