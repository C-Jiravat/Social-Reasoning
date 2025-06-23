import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { AuthProvider } from './hooks/useAuth'; // 1. Import AuthProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. ครอบ <App /> ด้วย <AuthProvider> */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);