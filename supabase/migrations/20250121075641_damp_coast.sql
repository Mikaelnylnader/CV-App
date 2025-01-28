-- First ensure clean slate for admin user
DO $$ 
BEGIN
    -- Remove any existing data for the admin user
    DELETE FROM subscriptions 
    WHERE user_id IN (
        SELECT id 
        FROM auth.users 
        WHERE email = 'mikael.nylander84@gmail.com'
    );

    DELETE FROM auth.users 
    WHERE email = 'mikael.nylander84@gmail.com';
END $$;

-- Ensure admin plan type exists
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

-- Create function to handle admin user creation
CREATE OR REPLACE FUNCTION handle_admin_user_creation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email = 'mikael.nylander84@gmail.com' THEN
        -- Set admin metadata
        NEW.raw_user_meta_data = jsonb_set(
            COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
            '{role}',
            '"admin"'
        );
        
        -- Ensure admin subscription is created
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
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for admin user handling
DROP TRIGGER IF EXISTS handle_admin_user ON auth.users;
CREATE TRIGGER handle_admin_user
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_admin_user_creation();