
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 py-12 container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="feature-card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground mb-4">
                  Have questions or feedback? We'd love to hear from you.
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">support@interviewally.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-muted-foreground">Monday-Friday, 9AM-5PM PST</p>
                  </div>
                </div>
              </div>
              <div className="feature-card p-6">
                <h2 className="text-xl font-bold mb-4">Office</h2>
                <p className="text-muted-foreground">
                  123 Tech Avenue<br />
                  San Francisco, CA 94107<br />
                  United States
                </p>
              </div>
            </div>
            
            <div className="feature-card p-6">
              <h2 className="text-xl font-bold mb-4">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary/30"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary/30"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-secondary/30 min-h-[120px]"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/80 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
