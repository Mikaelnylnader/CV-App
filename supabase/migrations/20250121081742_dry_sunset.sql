/*
  # Fix user creation trigger and subscription handling

  1. Changes
    - Improve error handling in trigger function
    - Fix subscription creation logic
    - Add proper exception handling
    - Ensure atomic transactions
  
  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create or replace the function to handle new users with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Wrap everything in a transaction
    BEGIN
        -- Create profile first
        INSERT INTO public.profiles (id, full_name)
        VALUES (
            NEW.id,
            COALESCE(
                NEW.raw_user_meta_data->>'full_name',
                split_part(NEW.email, '@', 1)
            )
        )
        ON CONFLICT (id) DO NOTHING;

        -- Handle admin user
        IF NEW.email = 'mikael.nylander84@gmail.com' THEN
            -- Set admin metadata
            UPDATE auth.users
            SET raw_user_meta_data = jsonb_build_object(
                'role', 'admin',
                'full_name', COALESCE(
                    NEW.raw_user_meta_data->>'full_name',
                    split_part(NEW.email, '@', 1)
                )
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
                'admin'::plan_type,
                'active'::subscription_status,
                (now() + interval '100 years')
            )
            ON CONFLICT (user_id) DO UPDATE
            SET 
                plan = 'admin'::plan_type,
                status = 'active'::subscription_status,
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
                'free'::plan_type,
                'active'::subscription_status
            )
            ON CONFLICT (user_id) DO NOTHING;
        END IF;

        RETURN NEW;
    EXCEPTION WHEN OTHERS THEN
        -- Log the error (Supabase will capture this in the logs)
        RAISE LOG 'Error in handle_new_user(): %', SQLERRM;
        -- Roll back to clean state
        ROLLBACK;
        -- Still return NEW to allow user creation
        RETURN NEW;
    END;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;
GRANT ALL ON subscriptions TO authenticated;
GRANT ALL ON subscriptions TO service_role;