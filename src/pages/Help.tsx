import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Minus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
  link?: {
    text: string;
    to: string;
  };
};

const FAQSection = ({ title, items }: { title: string; items: FAQItem[] }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="feature-card overflow-hidden">
            <button
              className="w-full px-4 py-0.5 text-left flex items-center justify-between gap-4"
              onClick={() => toggleItem(index)}
            >
              <h3 className="text-lg font-medium flex-1 text-left">{item.question}</h3>
              {openItems.includes(index) ? (
                <Minus className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Plus className="h-4 w-4 flex-shrink-0" />
              )}
            </button>
            {openItems.includes(index) && (
              <div className="px-4 pb-4">
                <p className="text-muted-foreground">{item.answer}</p>
                {item.link && (
                  <div className="mt-4">
                    <Link to={item.link.to}>
                      <Button variant="outline" className="text-sm">
                        {item.link.text}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default function Help() {
  const sections = [
    {
      title: "Getting Started",
      items: [
        {
          question: "How do I install InterviewAlly?",
          answer: "Download the appropriate version for your operating system (Windows or macOS) from our download page. Run the installer and follow the setup instructions. After installation, you'll need to activate the software with your license key.",
          link: {
            text: "Go to Download Page",
            to: "/download"
          }
        },
        {
          question: "How do I activate my license?",
          answer: "After subscribing, you'll find your license key in your dashboard. Launch the app, click on 'Activate License' and enter your key. The activation is immediate and you can start using all features right away."
        },
        {
          question: "What are the system requirements?",
          answer: "InterviewAlly requires Windows 10 (or later) or macOS 10.15 (or later). A stable internet connection is needed for activation and real-time assistance. Minimum 4GB RAM and 1GB free disk space recommended."
        }
      ]
    },
    {
      title: "Features",
      items: [
        {
          question: "How does the invisible assistance work?",
          answer: "Our technology ensures that the assistance remains completely invisible to any screen recording software used during interviews. The app operates in a special mode that bypasses standard screen capture methods while still providing you with real-time help."
        },
        {
          question: "What kind of DSA problems can it solve?",
          answer: "InterviewAlly can assist with a wide range of Data Structures and Algorithms problems, including array manipulation, tree traversal, dynamic programming, graph algorithms, and more. The AI companion analyzes the problem and provides optimized solutions with explanations."
        },
        {
          question: "Which coding platforms are supported?",
          answer: "InterviewAlly works seamlessly with major technical interview platforms including HackerRank, LeetCode, CodeSignal, and many others. The app automatically detects the platform and adjusts its assistance accordingly."
        }
      ]
    },
    {
      title: "Troubleshooting",
      items: [
        {
          question: "The app isn't detecting my interview platform",
          answer: "Ensure you've granted the necessary permissions to InterviewAlly. The app supports major interview platforms including HackerRank, LeetCode, and CodeSignal. If issues persist, try restarting both the interview platform and InterviewAlly."
        },
        {
          question: "My license key isn't working",
          answer: "Verify that you've entered the key exactly as shown in your dashboard. If the problem continues, ensure you're connected to the internet and try reactivating. For persistent issues, contact our support team."
        },
        {
          question: "The app is running slowly",
          answer: "Check your internet connection as real-time assistance requires stable connectivity. Close unnecessary background applications to free up system resources. If the issue persists, try restarting the application."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Help Center</h1>
        
        <div className="max-w-3xl mx-auto space-y-12">
          {sections.map((section, index) => (
            <FAQSection key={index} title={section.title} items={section.items} />
          ))}

          <div className="text-center pt-8">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Link to="/contact">
              <Button className="bg-accent hover:bg-accent/80 text-white">
                Contact Support
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
