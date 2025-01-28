-- Add admin user and set up admin privileges
DO $$ 
BEGIN
    -- Create admin subscription type if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'plan_type' 
        AND 'admin' = ANY(enum_range(NULL::plan_type)::text[])
    ) THEN
        -- Temporarily alter existing subscriptions
        ALTER TABLE subscriptions 
        ALTER COLUMN plan DROP DEFAULT;

        -- Create new enum type with admin value
        CREATE TYPE plan_type_new AS ENUM ('free', 'pro', 'lifetime', 'admin');

        -- Update subscriptions table to use new type
        ALTER TABLE subscriptions 
        ALTER COLUMN plan TYPE plan_type_new 
        USING (plan::text::plan_type_new);

        -- Drop old type
        DROP TYPE plan_type;

        -- Rename new type to original name
        ALTER TYPE plan_type_new RENAME TO plan_type;

        -- Restore default
        ALTER TABLE subscriptions 
        ALTER COLUMN plan SET DEFAULT 'free'::plan_type;
    END IF;

    -- Create admin subscription
    INSERT INTO subscriptions (
        user_id,
        plan,
        status,
        current_period_end
    )
    SELECT 
        id,
        'admin'::plan_type,
        'active'::subscription_status,
        (now() + interval '100 years')
    FROM auth.users
    WHERE email = 'mikael.nylander84@gmail.com'
    ON CONFLICT (user_id) DO UPDATE
    SET 
        plan = 'admin'::plan_type,
        status = 'active'::subscription_status,
        current_period_end = (now() + interval '100 years');

    -- Grant admin role in auth.users if needed
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
    )
    WHERE email = 'mikael.nylander84@gmail.com';
END $$;