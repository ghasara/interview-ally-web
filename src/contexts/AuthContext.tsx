
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define explicit types to avoid circular references
type AuthError = {
  message: string;
} | null;

// Define a simpler response type without circular references
type AuthResponse = {
  error: AuthError;
  data: {
    user?: User | null;
    session?: Session | null;
  } | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    email: string,
    password: string, 
    fullName: string
  ) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resendVerification: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // First, set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sessionData) => {
        setSession(sessionData);
        setUser(sessionData?.user ?? null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: sessionData } }) => {
      setSession(sessionData);
      setUser(sessionData?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (response.error) {
        toast.error(response.error.message);
      } else if (response.data.user) {
        if (!response.data.user.email_confirmed_at) {
          toast.error('Please verify your email before logging in');
          await supabase.auth.signOut();
          return { 
            error: { message: 'Email not verified' }, 
            data: null 
          };
        }
        
        toast.success('Login successful!');
        navigate("/dashboard");
      }
      
      return response;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' }, data: null };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    try {
      // First, check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      // If email already exists
      if (existingUser) {
        toast.error('This email is already registered. Please sign in instead.');
        return { error: { message: "Email already exists" }, data: null };
      }
      
      // Sign up the user with Supabase Auth
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/verification-success`,
        },
      });
      
      if (response.error) {
        // Check for duplicate email in the response
        if (response.error.message.includes('already') || response.error.message.includes('taken')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(response.error.message);
        }
      } else {
        toast.success('Verification email sent! Please check your inbox and verify your email before logging in.');
        navigate("/verify-email", { state: { email } });
      }
      
      return response;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' }, data: null };
    }
  };

  const resendVerification = async (email: string): Promise<AuthResponse> => {
    try {
      const response = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verification-success`,
        },
      });
      
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success('Verification email resent! Please check your inbox.');
      }
      
      return response;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' }, data: null };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success('Password reset email sent! Please check your inbox.');
      }
      
      return response;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' }, data: null };
    }
  };

  const updatePassword = async (password: string): Promise<AuthResponse> => {
    try {
      const response = await supabase.auth.updateUser({
        password: password,
      });
      
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success('Password updated successfully!');
        navigate("/login");
      }
      
      return response;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' }, data: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.info('You have been logged out');
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ 
        session, 
        user, 
        isLoading, 
        signIn, 
        signUp, 
        signOut, 
        resendVerification, 
        resetPassword, 
        updatePassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
