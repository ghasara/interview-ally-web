
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Image } from "@/components/ui/image";
import { Check } from "lucide-react";

export function AppScreenshots() {
  return (
    <section className="py-16 md:py-24" id="screenshots">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            InterviewAlly in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See our app solving real coding interview problems
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Screenshot 1 */}
          <div className="feature-card p-4 hoverable-card animate-fade-in">
            <AspectRatio ratio={16/9}>
              <Image 
                src="/images/getting_solution_from_problem.png" 
                alt="Problem capture" 
                className="rounded-lg w-full h-full object-cover"
              />
            </AspectRatio>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Capture Problems Instantly</h3>
              <p className="text-muted-foreground text-sm">
                Take a screenshot of any coding problem and InterviewAlly will analyze it.
              </p>
              <div className="mt-3 flex items-center text-accent">
                <Check className="h-4 w-4 mr-2" /> 
                <span className="text-sm">Works with all major interview platforms</span>
              </div>
            </div>
          </div>
          
          {/* Screenshot 2 */}
          <div className="feature-card p-4 hoverable-card animate-fade-in animation-delay-2000">
            <AspectRatio ratio={16/9}>
              <Image 
                src="/images/got_solution_from_problem.png" 
                alt="Solution generation" 
                className="rounded-lg w-full h-full object-cover" 
              />
            </AspectRatio>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Get Instant Solutions</h3>
              <p className="text-muted-foreground text-sm">
                Receive optimized code solutions with detailed explanations.
              </p>
              <div className="mt-3 flex items-center text-accent">
                <Check className="h-4 w-4 mr-2" /> 
                <span className="text-sm">Multiple language support</span>
              </div>
            </div>
          </div>
          
          {/* Screenshot 3 */}
          <div className="feature-card p-4 hoverable-card animate-fade-in animation-delay-4000">
            <AspectRatio ratio={16/9}>
              <Image 
                src="/images/debug_solution.png" 
                alt="Real-time debugging" 
                className="rounded-lg w-full h-full object-cover"
              />
            </AspectRatio>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Debug in Real-time</h3>
              <p className="text-muted-foreground text-sm">
                Get help with debugging and optimizing your solutions during interviews.
              </p>
              <div className="mt-3 flex items-center text-accent">
                <Check className="h-4 w-4 mr-2" /> 
                <span className="text-sm">Step-by-step explanations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
