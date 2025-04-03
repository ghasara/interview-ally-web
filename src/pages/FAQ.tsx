
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 py-12 container px-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-6 max-w-3xl">
          <div className="feature-card p-6">
            <h2 className="text-xl font-bold mb-2">How does InterviewAlly work?</h2>
            <p className="text-muted-foreground">
              InterviewAlly uses AI to analyze your coding problems and provides invisible assistance during technical interviews.
              It helps you solve algorithms, data structures, and other coding challenges quickly and efficiently.
            </p>
          </div>
          
          <div className="feature-card p-6">
            <h2 className="text-xl font-bold mb-2">Is it detectable during coding interviews?</h2>
            <p className="text-muted-foreground">
              No, InterviewAlly is designed to be completely invisible to screen recording software.
              It uses advanced techniques to ensure that your usage cannot be detected by interviewers or proctoring systems.
            </p>
          </div>
          
          <div className="feature-card p-6">
            <h2 className="text-xl font-bold mb-2">How many credits do I need for an interview?</h2>
            <p className="text-muted-foreground">
              Each coding problem typically requires 1 credit to solve.
              For a typical interview with 2-3 problems, you would need 2-3 credits.
              Our subscription plans provide enough credits for multiple interviews per month.
            </p>
          </div>
          
          <div className="feature-card p-6">
            <h2 className="text-xl font-bold mb-2">Can I use it on any platform?</h2>
            <p className="text-muted-foreground">
              Yes, InterviewAlly works on both Windows and macOS.
              It's compatible with all major coding platforms and interview environments.
            </p>
          </div>
          
          <div className="feature-card p-6">
            <h2 className="text-xl font-bold mb-2">How do I get started?</h2>
            <p className="text-muted-foreground">
              Sign up for an account, choose a subscription plan, and download our desktop application.
              After installation, use your license key to activate the software and you're ready to go!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
