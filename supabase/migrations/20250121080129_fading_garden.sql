-- Create profiles table for user metadata
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create trigger to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

    -- Handle admin user
    IF NEW.email = 'mikael.nylander84@gmail.com' THEN
        -- Set admin metadata
        NEW.raw_user_meta_data = jsonb_set(
            COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
            '{role}',
            '"admin"'
        );
        
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();