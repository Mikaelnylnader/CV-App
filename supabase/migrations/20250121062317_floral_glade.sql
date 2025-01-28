-- Remove user and associated data safely
DO $$ 
BEGIN
    -- First remove any subscriptions
    DELETE FROM subscriptions 
    WHERE user_id IN (
        SELECT id 
        FROM auth.users 
        WHERE email = 'mikael.nylander84@gmail.com'
    );

    -- Remove any resumes and their storage objects
    DELETE FROM storage.objects
    WHERE bucket_id = 'resumes' 
    AND (storage.foldername(name))[1] IN (
        SELECT id::text 
        FROM auth.users 
        WHERE email = 'mikael.nylander84@gmail.com'
    );

    DELETE FROM resumes 
    WHERE user_id IN (
        SELECT id 
        FROM auth.users 
        WHERE email = 'mikael.nylander84@gmail.com'
    );

    -- Remove any blog posts
    DELETE FROM blog_posts
    WHERE author = 'mikael.nylander84@gmail.com';

    -- Finally remove the user from auth.users
    DELETE FROM auth.users 
    WHERE email = 'mikael.nylander84@gmail.com';
END $$;