import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { StudentProvider } from './contexts/StudentContext'
import { HalaqahProvider } from './contexts/HalaqahContext'
import { MemorizationProvider } from './contexts/MemorizationContext'
import { AttendanceProvider } from './contexts/AttendanceContext'
import { ActivityProvider } from './contexts/ActivityContext'
import { FinanceProvider } from './contexts/FinanceContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/toaster'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt'

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProfileProvider>
        <StudentProvider>
          <HalaqahProvider>
            <MemorizationProvider>
              <AttendanceProvider>
                <ActivityProvider>
                  <FinanceProvider>
                    <TooltipProvider>
                      <App />
                      <Toaster />
                      <PWAInstallPrompt />
                      <PWAUpdatePrompt />
                    </TooltipProvider>
                  </FinanceProvider>
                </ActivityProvider>
              </AttendanceProvider>
            </MemorizationProvider>
          </HalaqahProvider>
        </StudentProvider>
      </ProfileProvider>
    </AuthProvider>
  </QueryClientProvider>
);
