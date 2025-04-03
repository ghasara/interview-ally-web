
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 gradient-text">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="bg-accent hover:bg-accent/80 text-white">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
