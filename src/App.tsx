
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import Download from "./pages/Download";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PaymentSuccess from "./pages/PaymentSuccess";
import VerifyEmail from "./pages/VerifyEmail";
import VerificationSuccess from "./pages/VerificationSuccess";
import { Analytics } from "@vercel/analytics/react"
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark">
        <Toaster />
        <Sonner />
        <Analytics/>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verification-success" element={<VerificationSuccess />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/help" element={<Help />} />
              <Route path="/download" element={<Download />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
