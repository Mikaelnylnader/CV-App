/*
  # Add admin plan type and update subscriptions

  1. Changes
    - Create new plan type with admin value
    - Update subscriptions table to use new type
    - Set admin plan for specific user and beta testers
  
  2. Security
    - Maintain existing RLS policies
*/

-- First remove the default constraint
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

-- Add back the default constraint
ALTER TABLE subscriptions 
ALTER COLUMN plan SET DEFAULT 'free'::plan_type;

-- Update admin user's subscription
UPDATE subscriptions 
SET plan = 'admin'
WHERE user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'mikael.nylander84@gmail.com'
);

-- Update beta testers' subscriptions to pro
UPDATE subscriptions 
SET plan = 'pro',
    status = 'active',
    current_period_end = NOW() + INTERVAL '1 year'
WHERE user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE email IN (
        'tester1@example.com',
        'tester2@example.com',
        'tester3@example.com',
        'tester4@example.com',
        'tester5@example.com',
        'tester6@example.com',
        'tester7@example.com',
        'tester8@example.com',
        'tester9@example.com',
        'tester10@example.com'
    )
);