-- Remove admin user and associated data
DO $$ 
BEGIN
    -- First remove any subscriptions
    DELETE FROM subscriptions 
    WHERE user_id IN (
        SELECT id 
        FROM auth.users 
        WHERE email = 'mikael.nylander84@gmail.com'
    );

    -- Remove any resumes
    DELETE FROM resumes 
    WHERE user_id IN (
        SELECT id 
        FROM auth.users 
        WHERE email = 'mikael.nylander84@gmail.com'
    );

    -- Finally remove the user
    DELETE FROM auth.users 
    WHERE email = 'mikael.nylander84@gmail.com';
END $$;