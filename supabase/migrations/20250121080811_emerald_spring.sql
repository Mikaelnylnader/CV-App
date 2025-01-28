-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_admin_user ON auth.users;

-- Ensure plan_type enum has admin value
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'plan_type' 
        AND 'admin' = ANY(enum_range(NULL::plan_type)::text[])
    ) THEN
        ALTER TYPE plan_type ADD VALUE IF NOT EXISTS 'admin';
    END IF;
END $$;

-- Create or replace the function to handle new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
    ON CONFLICT (id) DO NOTHING;

    -- Handle admin user
    IF NEW.email = 'mikael.nylander84@gmail.com' THEN
        -- Set admin metadata
        UPDATE auth.users
        SET raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{role}',
            '"admin"'
        )
        WHERE id = NEW.id;
        
        -- Create admin subscription
        INSERT INTO public.subscriptions (
            user_id,
            plan,
            status,
            current_period_end
        )
        VALUES (
            NEW.id,
            'admin',
            'active',
            (now() + interval '100 years')
        )
        ON CONFLICT (user_id) DO UPDATE
        SET 
            plan = 'admin',
            status = 'active',
            current_period_end = (now() + interval '100 years');
    ELSE
        -- Create free subscription for non-admin users
        INSERT INTO public.subscriptions (
            user_id,
            plan,
            status
        )
        VALUES (
            NEW.id,
            'free',
            'active'
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Ensure profiles table exists and has proper structure
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Recreate profile policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- Ensure subscriptions table has proper structure
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Enable RLS on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Recreate subscription policies
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;

CREATE POLICY "Users can view their own subscription"
    ON subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
    ON subscriptions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);