
import { Code, Cpu, Eye, EyeOff, Fingerprint, MonitorSmartphone, Shield, Sparkles } from "lucide-react";

export function Features() {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/5">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Invisible. Intelligent. Indispensable.
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our cutting-edge technology works seamlessly with all major interview platforms, giving you the edge you need without being detected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<EyeOff />}
            title="Completely Invisible"
            description="Undetectable by all screen recording software including Zoom, HackerRank, CodeSignal, and more."
            delay="0"
          />
          <FeatureCard 
            icon={<Cpu />}
            title="AI-Powered Solutions"
            description="Get expert-level solutions to DSA problems with detailed explanations and time complexity analysis."
            delay="200"
          />
          <FeatureCard 
            icon={<Code />}
            title="Real-time Problem Solving"
            description="Capture screenshots of problems and get instant solutions with step-by-step explanations."
            delay="400"
          />
          <FeatureCard 
            icon={<Shield />}
            title="Secure & Private"
            description="Your data never leaves your device. All processing happens locally for maximum privacy."
            delay="600"
          />
          <FeatureCard 
            icon={<MonitorSmartphone />}
            title="Works Everywhere"
            description="Compatible with all major interview platforms including HackerRank, LeetCode, CodeSignal, and more."
            delay="800"
          />
          <FeatureCard 
            icon={<Fingerprint />}
            title="Simple & Natural Commands"
            description="Intuitive keyboard shortcuts that feel natural and are easy to remember even under pressure."
            delay="1000"
          />
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8 inline-flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Coming Soon in Version 2.0
            <Sparkles className="h-5 w-5 text-accent" />
          </h3>
          
          <div className="feature-card max-w-2xl mx-auto p-8 animate-bounce-subtle">
            <h4 className="text-xl font-bold mb-4 text-accent">Real-time Transcription</h4>
            <p className="text-muted-foreground mb-4">
              Our next update will include real-time transcription capabilities that process your interview questions and provide instant answers for both technical and non-technical interviews.
            </p>
            <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              Stay tuned for updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <div 
      className="feature-card hoverable-card" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
