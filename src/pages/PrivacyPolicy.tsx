
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 py-12 container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="feature-card p-6 prose prose-invert max-w-none">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>Introduction</h2>
            <p>
              InterviewAlly ("we", "our", or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and share your personal information
              when you use our website and services.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We may collect the following types of information:
            </p>
            <ul>
              <li>Account information: Your name, email address, and password when you create an account.</li>
              <li>Payment information: When you subscribe to our services, our payment processor collects billing information.</li>
              <li>Usage data: Information about how you use our website and services.</li>
              <li>Device information: Information about the device you use to access our services.</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              We use your information to:
            </p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Process payments</li>
              <li>Communicate with you about our services</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Protect against unauthorized access</li>
            </ul>
            
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, disclosure, alteration, or destruction.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information,
              including the right to access, correct, or delete your data.
            </p>
            
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@interviewally.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
