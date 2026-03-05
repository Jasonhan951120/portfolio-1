console.log("main.tsx: Execution started");
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("main.tsx: Client ID =", googleClientId);

const rootElement = document.getElementById('root');
console.log("main.tsx: rootElement =", rootElement);

if (!rootElement) {
  console.error("main.tsx: ERROR - #root element not found!");
} else {
  console.log("main.tsx: Starting render...");
  createRoot(rootElement).render(
    <StrictMode>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <App />
        </GoogleOAuthProvider>
      ) : (
        <App />
      )}
    </StrictMode>,
  );
  console.log("main.tsx: Render call completed");
}
