CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  ai_queries_used INT DEFAULT 0,
  ai_queries_limit INT DEFAULT 5,
  family_group_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  chart_data JSONB NOT NULL,
  chart_type TEXT,
  notes TEXT,
  is_shared BOOLEAN DEFAULT FALSE,
  shared_link TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles (users can only access their own profile)
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RLS policies for charts (users can only access their own charts)
CREATE POLICY "select_own_charts" ON charts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_charts" ON charts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_charts" ON charts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_charts" ON charts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_charts_user_id ON charts(user_id);
CREATE INDEX idx_profiles_email ON profiles(email);