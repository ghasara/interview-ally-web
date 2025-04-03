
import { ArrowRight } from "lucide-react";

export function Screenshots() {
  return (
    <div className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            How InterviewAlly Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See how our platform helps you ace your technical interviews
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="space-y-8">
              <div className="feature-card p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center text-accent">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent mr-3">1</span>
                  Subscribe &amp; Download
                </h3>
                <p className="text-muted-foreground">
                  Create an account, choose a subscription plan or redeem a promo code, and download the InterviewAlly application for your platform.
                </p>
              </div>
              
              <div className="feature-card p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center text-accent">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent mr-3">2</span>
                  Activate with License Key
                </h3>
                <p className="text-muted-foreground">
                  Use the license key generated in your dashboard to activate the application. Your key is uniquely tied to your account.
                </p>
              </div>
              
              <div className="feature-card p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center text-accent">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent mr-3">3</span>
                  Capture &amp; Solve Problems
                </h3>
                <p className="text-muted-foreground">
                  During interviews, capture the coding problem with a screenshot and get instant solutions with detailed explanations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative animate-fade-in animation-delay-1000">
            <div className="p-3 rounded-2xl overflow-hidden relative">
              <img 
                src="/images/enter_licence_key.png" 
                alt="InterviewAlly screenshot" 
                className="rounded-xl w-full"
              />
              <div className="absolute bottom-3 left-3 right-3 p-4 bg-black/60 backdrop-blur-sm rounded-lg">
                <p className="text-white text-sm">
                  InterviewAlly's real-time problem-solving interface helps you ace technical interviews
                </p>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 transform rotate-12 z-10 animate-bounce-subtle">
              <div className="bg-accent px-4 py-2 rounded-lg text-white font-medium flex items-center shadow-lg">
                <span>Completely invisible</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
