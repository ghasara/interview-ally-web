
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 py-12 container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="feature-card p-6 prose prose-invert max-w-none">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>Introduction</h2>
            <p>
              These Terms of Service govern your use of InterviewAlly ("the Service").
              By using the Service, you agree to these terms.
            </p>
            
            <h2>Account Registration</h2>
            <p>
              To use certain features of the Service, you must register for an account.
              You must provide accurate and complete information and keep your account information updated.
            </p>
            
            <h2>Subscription and Payments</h2>
            <p>
              Some features of the Service require a paid subscription.
              Payment terms and refund policies are described at the time of purchase.
            </p>
            
            <h2>License Terms</h2>
            <p>
              When you purchase a subscription, we grant you a license to use the Service
              according to the terms of your subscription.
              The license is personal, non-transferable, and non-exclusive.
            </p>
            
            <h2>Prohibited Uses</h2>
            <p>
              You may not use the Service to violate any applicable laws or regulations,
              or for any purpose that is harmful to others.
            </p>
            
            <h2>Intellectual Property</h2>
            <p>
              The Service and its content are owned by InterviewAlly and are protected by copyright,
              trademark, and other intellectual property laws.
            </p>
            
            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account at any time if you violate these Terms.
              You may cancel your subscription at any time.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, InterviewAlly shall not be liable
              for any indirect, incidental, special, consequential, or punitive damages.
            </p>
            
            <h2>Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of any changes
              by posting the new Terms on this page.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@interviewally.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
