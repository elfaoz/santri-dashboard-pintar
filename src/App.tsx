import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentProvider } from "@/contexts/StudentContext";
import { HalaqahProvider } from "@/contexts/HalaqahContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { MemorizationProvider } from "@/contexts/MemorizationContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { ActivityProvider } from "@/contexts/ActivityContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { EventProvider } from "@/contexts/EventContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Halaqah from "./pages/Halaqah";
import Activities from "./pages/Activities";
import Finance from "./pages/Finance";
import AddStudent from "./pages/AddStudent";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import KDM from "./pages/KDM";
import UpgradePlan from "./pages/UpgradePlan";
import Payment from "./pages/Payment";
import Install from "./pages/Install";
import Event from "./pages/Event";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <EventProvider>
          <StudentProvider>
            <HalaqahProvider>
              <MemorizationProvider>
                <AttendanceProvider>
                  <ActivityProvider>
                    <FinanceProvider>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                          <Routes>
                            {/* Halaman publik */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/kdm" element={<KDM />} />
                            <Route path="/upgrade" element={<UpgradePlan />} />
                            <Route path="/payment" element={<Payment />} />
                            <Route path="/install" element={<Install />} />

                            {/* Dashboard - guest allowed */}
                            <Route
                              path="/dashboard"
                              element={
                                <ProtectedRoute guestAllowed={true}>
                                  <Layout>
                                    <Dashboard />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            
                            {/* Halaman yang dilindungi */}
                            <Route
                              path="/profile"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Profile />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/attendance"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Attendance />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/halaqah"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Halaqah />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/activities"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Activities />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/finance"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Finance />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/event"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Event />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/add-student"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <AddStudent />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </BrowserRouter>
                      </TooltipProvider>
                    </FinanceProvider>
                  </ActivityProvider>
                </AttendanceProvider>
              </MemorizationProvider>
            </HalaqahProvider>
          </StudentProvider>
        </EventProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
