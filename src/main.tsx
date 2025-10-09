import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StudentProvider } from './contexts/StudentContext'
import { MemorizationProvider } from './contexts/MemorizationContext'

createRoot(document.getElementById("root")!).render(
  <StudentProvider>
    <MemorizationProvider>
      <App />
    </MemorizationProvider>
  </StudentProvider>
);
