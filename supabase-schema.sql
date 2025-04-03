
-- This is a SQL schema for Supabase that will be used when the Supabase integration is connected

-- Create users table extension (this is automatically created by Supabase auth)
-- This is here for reference only

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  interval TEXT NOT NULL,
  interval_count INTEGER NOT NULL,
  status TEXT NOT NULL,
  credits_per_month INTEGER NOT NULL,
  credits_remaining INTEGER NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create license_keys table
CREATE TABLE license_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) NOT NULL,
  license_key TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create user_profiles table for additional user information
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_transactions table to track credit usage
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id),
  payment_provider TEXT NOT NULL,
  payment_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create licenses table with credits
CREATE TABLE licenses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  key TEXT,
  credits INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  promo_code_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promo_codes table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create redeemed_promo_codes to track usage
CREATE TABLE redeemed_promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  promo_code_id UUID REFERENCES promo_codes(id) NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create downloads table to track app downloads
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  platform TEXT NOT NULL,
  file_name TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies

-- Enable RLS on all tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE redeemed_promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policies for license_keys
CREATE POLICY "Users can view their own license keys"
  ON license_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for credit_transactions
CREATE POLICY "Users can view their own credit transactions"
  ON credit_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policies for payment_transactions
CREATE POLICY "Users can view their own payment transactions"
  ON payment_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policies for licenses
CREATE POLICY "Users can view their own licenses"
  ON licenses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own licenses"
  ON licenses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for promo_codes (everyone can view active promo codes)
CREATE POLICY "Anyone can view active promo codes"
  ON promo_codes
  FOR SELECT
  USING (is_active = true);

-- Create policies for redeemed_promo_codes
CREATE POLICY "Users can view their own redeemed promo codes"
  ON redeemed_promo_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own redeemed promo codes"
  ON redeemed_promo_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for downloads
CREATE POLICY "Users can view their own downloads"
  ON downloads
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own downloads"
  ON downloads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add functions and triggers

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to create a profile after a new user signs up
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auth.users
CREATE TRIGGER create_profile_after_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_new_user();

-- Sample data for testing
INSERT INTO promo_codes (code, credits, is_active) 
VALUES ('WELCOME2024', 10, true), ('STARTER100', 25, true);