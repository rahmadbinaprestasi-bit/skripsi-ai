-- =====================================================
-- skripsiAi Database Schema
-- Run in Supabase SQL Editor (sequential order)
-- =====================================================

-- 1. PROFILES TABLE
-- Extends auth.users, auto-created via trigger
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'unlimited')),
  word_quota INTEGER NOT NULL DEFAULT 3000,
  word_used INTEGER NOT NULL DEFAULT 0,
  affiliate_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. SUBSCRIPTION PLANS TABLE
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_normal INTEGER NOT NULL,
  price_promo INTEGER,
  word_limit INTEGER NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  promo_end_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (name, slug, price_normal, price_promo, word_limit, features, sort_order)
VALUES
  ('Free', 'free', 0, NULL, 3000, '["AI Writer", "AI Chat", "3 Dokumen"]', 0),
  ('Basic', 'basic', 49000, 29000, 25000, '["All Free", "AI Code", "Ekspor Word"]', 1),
  ('Pro', 'pro', 99000, 59000, 80000, '["All Basic", "Cek Referensi", "Prioritas"]', 2),
  ('Unlimited', 'unlimited', 199000, 99000, -1, '["Semua Fitur", "Kuota Tak Terbatas", "Support 24/7"]', 3)
ON CONFLICT (slug) DO NOTHING;

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  plan_id INTEGER REFERENCES subscription_plans(id),
  merchant_order_id TEXT UNIQUE NOT NULL,
  reference TEXT,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired')),
  payment_method TEXT,
  payment_url TEXT,
  expires_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GENERATE LOGS TABLE
CREATE TABLE IF NOT EXISTS generate_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  module TEXT NOT NULL CHECK (module IN ('writer', 'chat', 'code', 'reference')),
  prompt TEXT,
  word_count INTEGER NOT NULL DEFAULT 0,
  model_used TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL DEFAULT 'Dokumen Tanpa Judul',
  content TEXT,
  module TEXT,
  is_starred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AFFILIATE COMMISSIONS TABLE
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id),
  referred_id UUID NOT NULL REFERENCES profiles(id),
  transaction_id UUID REFERENCES transactions(id),
  commission_type TEXT CHECK (commission_type IN ('cash', 'quota')),
  amount INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DEVICE FINGERPRINTS (Anti-Abuse)
CREATE TABLE IF NOT EXISTS device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  fingerprint_hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fingerprint_hash ON device_fingerprints(fingerprint_hash);
CREATE INDEX idx_ip_address ON device_fingerprints(ip_address);

-- 8. ABUSE FLAGS TABLE
CREATE TABLE IF NOT EXISTS abuse_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  fingerprint_hash TEXT,
  ip_address TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_abuse_ip ON abuse_flags(ip_address);
CREATE INDEX idx_abuse_fingerprint ON abuse_flags(fingerprint_hash);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generate_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Generate logs policies
CREATE POLICY "Users can view own logs" ON generate_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" ON generate_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can manage own documents" ON documents
  FOR ALL USING (auth.uid() = user_id);

-- Affiliate commissions policies
CREATE POLICY "Users can view own commissions" ON affiliate_commissions
  FOR SELECT USING (auth.uid() = referrer_id);

-- Subscription plans - public read for everyone
CREATE POLICY "Anyone can view active plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_plan ON profiles(plan);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_merchant ON transactions(merchant_order_id);
CREATE INDEX idx_generate_logs_user ON generate_logs(user_id);
CREATE INDEX idx_generate_logs_module ON generate_logs(module);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_updated ON documents(updated_at);