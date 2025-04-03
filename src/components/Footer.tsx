
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 md:py-16 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Logo className="mb-6" />
            <p className="text-muted-foreground mb-6 max-w-md">
              Ace your technical interviews with AI-powered, invisible assistance for coding challenges and algorithm problems.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://twitter.com" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="https://github.com" icon={<Github className="h-5 w-5" />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin className="h-5 w-5" />} />
              <SocialLink href="https://instagram.com" icon={<Instagram className="h-5 w-5" />} />
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-3">
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/download">Download</FooterLink>
              {/* <FooterLink to="/changelog">Changelog</FooterLink> */}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} interviewally. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">
              Designed for job seekers, by job seekers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

function SocialLink({ href, icon }: SocialLinkProps) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-10 w-10 rounded-full bg-secondary/50 hover:bg-accent/10 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
    >
      {icon}
    </a>
  );
}

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

function FooterLink({ to, children }: FooterLinkProps) {
  return (
    <li>
      <Link to={to} className="text-muted-foreground hover:text-accent transition-colors">
        {children}
      </Link>
    </li>
  );
}
