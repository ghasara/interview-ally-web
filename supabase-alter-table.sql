
-- Add user_id column to licenses table if it doesn't already exist
ALTER TABLE IF EXISTS public.licenses
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add RLS policies for licenses table
ALTER TABLE IF EXISTS public.licenses ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to see their own licenses
CREATE POLICY IF NOT EXISTS "Users can view their own licenses" 
  ON public.licenses 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own licenses
CREATE POLICY IF NOT EXISTS "Users can insert their own licenses" 
  ON public.licenses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
