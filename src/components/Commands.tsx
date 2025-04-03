
import { Command } from "lucide-react";

const shortcuts = [
  {
    key: "⌘ B",
    description: "Hide/show the interviewally window instantly.",
  },
  {
    key: "⌘ H",
    description: "Problem Mode: Capture screenshots of the interview question and requirements.\nSolution Mode: Take screenshots of a follow up question or new requirements.",
    isMultiline: true,
  },
  {
    key: "⌘ ↵",
    description: "Problem Mode: Generate an initial solution with detailed explanations based on the problem screenshots.\nSolution Mode: Debug and optimize your existing solution based on existing solution and new screenshots.",
    isMultiline: true,
  },
  {
    key: "⌘ ↑↓←→",
    description: "Move the window around your screen without touching the mouse.",
  },
  {
    key: "⌘ R",
    description: "Reset everything to start fresh with a new problem.",
  },
  {
    key: "⌘ Q",
    description: "Quit the application to remove the functionality of all keyboard commands.",
  },
];

export function Commands() {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-secondary/5 to-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Command className="h-4 w-4" />
            Keyboard Shortcuts
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Natural, Intuitive Commands
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            These commands are designed to be natural and easy to remember, even under the pressure of an interview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {shortcuts.map((shortcut, index) => (
            <div 
              key={index} 
              className="feature-card hoverable-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="px-3 py-1.5 bg-accent text-white font-mono rounded-lg whitespace-nowrap">
                  {shortcut.key}
                </div>
                <div>
                  {shortcut.isMultiline ? (
                    shortcut.description.split('\n').map((line, i) => (
                      <p key={i} className={i === 0 ? "font-medium" : "text-muted-foreground mt-2"}>
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="font-medium">{shortcut.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
