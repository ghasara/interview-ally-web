
import { Camera, ChevronRight, Download, Lightbulb } from "lucide-react";
import { Image } from "@/components/ui/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function HowToUse() {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/5">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            How to Use
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            For an in-depth tutorial on setting it up, visit our help center
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Step 
            number={1}
            icon={<Download className="h-6 w-6" />}
            title="Subscribe & Download"
            description="Subscribe to interviewally and download the application"
            delay="0"
          />
          <Step 
            number={2}
            icon={<Camera className="h-6 w-6" />}
            title="Capture the Problem"
            description="Use ⌘ + H to capture the problem screenshots"
            delay="300"
          />
          <Step 
            number={3}
            icon={<Lightbulb className="h-6 w-6" />}
            title="Solve & Debug"
            description="Press ⌘ + ↵ to generate solutions with detailed explanations"
            delay="600"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          <div className="feature-card p-8">
            <div className="mb-6">
              <div className="text-sm font-medium text-accent mb-2">Example Solution</div>
              <h3 className="text-xl font-bold mb-4">Thoughts</h3>
              <p className="text-muted-foreground mb-6">
                We need to find two numbers that sum to the target value.
                We can use a hash map to store numbers we've seen.
                For each number, check if its complement exists in the map.
              </p>
            </div>

            <div className="p-4 bg-black rounded-lg overflow-x-auto mb-6">
              <pre className="text-sm font-mono text-white">
{`def twoSum(nums: List[int], target: int) -> List[int]:
    seen = {}  # Value -> Index mapping
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # No solution found`}
              </pre>
            </div>

            <div>
              <h4 className="font-bold mb-2">Complexity</h4>
              <p className="text-sm text-muted-foreground">
                Time Complexity: O(n)
                <br />
                Space Complexity: O(n)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

function Step({ number, icon, title, description, delay }: StepProps) {
  return (
    <div 
      className="flex flex-col items-center text-center animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-accent flex items-center justify-center text-white text-sm font-bold">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {number < 3 && (
        <ChevronRight className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 text-accent h-8 w-8" />
      )}
    </div>
  );
}
