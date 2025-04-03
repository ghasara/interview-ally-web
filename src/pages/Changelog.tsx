
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const changelogEntries = [
  {
    version: "1.0.0",
    date: "2023-10-15",
    changes: [
      "Initial release of InterviewAlly",
      "Support for macOS and Windows",
      "Basic algorithm solving capabilities",
      "Screen detection avoidance"
    ]
  },
  {
    version: "1.1.0",
    date: "2024-01-10",
    changes: [
      "Added support for more coding languages",
      "Improved solution generation",
      "Enhanced UI for desktop application",
      "Fixed several bugs related to screen capture"
    ]
  },
  {
    version: "1.2.0",
    date: "2024-04-05",
    changes: [
      "Added debugging assistance feature",
      "Improved algorithm explanation capabilities",
      "Added time complexity analysis",
      "Enhanced invisibility features"
    ]
  },
  {
    version: "1.3.0",
    date: "2024-08-20",
    changes: [
      "Current version",
      "Added support for LeetCode-style problems",
      "Improved solution quality for dynamic programming problems",
      "Added keyboard shortcuts for faster operation",
      "Enhanced stealth mode"
    ]
  }
];

export default function Changelog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 py-12 container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Changelog</h1>
          <div className="space-y-8">
            {changelogEntries.map((entry, index) => (
              <div key={index} className="feature-card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    Version {entry.version}
                    {index === 0 && 
                      <span className="ml-2 text-xs bg-accent text-white px-2 py-1 rounded-full">
                        Latest
                      </span>
                    }
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Released on {entry.date}
                  </p>
                </div>
                <ul className="space-y-2">
                  {entry.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
