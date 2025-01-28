-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create or replace the function to handle new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    is_admin boolean;
BEGIN
    -- Check if user is admin
    is_admin := NEW.email = 'mikael.nylander84@gmail.com';

    -- Create profile
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
    ON CONFLICT (id) DO NOTHING;

    -- Handle admin user
    IF is_admin THEN
        -- Set admin metadata
        UPDATE auth.users
        SET raw_user_meta_data = jsonb_build_object(
            'role', 'admin',
            'full_name', COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
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
            current_period_end = (now() + interval '100 years'),
            updated_at = now();
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

-- Ensure admin user has correct subscription
UPDATE subscriptions
SET 
    plan = 'admin',
    status = 'active',
    current_period_end = (now() + interval '100 years'),
    updated_at = now()
WHERE user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'mikael.nylander84@gmail.com'
);

-- Update admin user metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
    'role', 'admin',
    'full_name', COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
)
WHERE email = 'mikael.nylander84@gmail.com';