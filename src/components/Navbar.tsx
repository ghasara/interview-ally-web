import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-sm font-medium hover:text-accent transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-accent transition-colors">
              Pricing
            </Link>
            <Link to="/help" className="text-sm font-medium hover:text-accent transition-colors">
              Help Center
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* <ThemeToggle /> */}
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="hover:text-accent hover:bg-transparent">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="hover:text-accent hover:bg-transparent"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover:text-accent hover:bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-accent hover:bg-accent/80 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-accent focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isMenuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container px-4 pb-4 space-y-4">
          <Link
            to="/"
            className="block text-base font-medium hover:text-accent transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/features"
            className="block text-base font-medium hover:text-accent transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="block text-base font-medium hover:text-accent transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            to="/help"
            className="block text-base font-medium hover:text-accent transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Help Center
          </Link>
          <div className="flex flex-col space-y-2 pt-2 border-t border-border">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start hover:text-accent hover:bg-transparent">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:text-accent hover:bg-transparent"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start hover:text-accent hover:bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-accent hover:bg-accent/80 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}