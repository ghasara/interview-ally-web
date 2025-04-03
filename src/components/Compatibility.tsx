
import { Check } from "lucide-react";

const platforms = [
  "Zoom",
  "HackerRank",
  "CodeSignal",
  "CoderPad",
  "Chime",
  "Microsoft Teams",
  "LeetCode",
  "Google Meet",
  "BlueJeans",
  "Skype",
  "Amazon Chime",
  "WebEx",
];

export function Compatibility() {
  return (
    <div className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Works on Everything
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Invisible to all screen-recording software. Use interviewally with confidence on any platform.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {platforms.map((platform, index) => (
            <div 
              key={platform}
              className="p-4 bg-black/30 border border-gray-800 rounded-xl flex items-center space-x-3 hoverable-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-accent" />
              </div>
              <span className="font-medium">{platform}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
