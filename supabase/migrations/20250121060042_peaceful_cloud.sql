-- First remove the default constraint
ALTER TABLE subscriptions 
ALTER COLUMN plan DROP DEFAULT;

-- Create new enum type with admin value
CREATE TYPE plan_type_new AS ENUM ('free', 'pro', 'lifetime', 'admin');

-- Create a temporary column with the new type
ALTER TABLE subscriptions 
ADD COLUMN plan_new plan_type_new;

-- Copy data to the new column
UPDATE subscriptions 
SET plan_new = plan::text::plan_type_new;

-- Drop the old column
ALTER TABLE subscriptions 
DROP COLUMN plan;

-- Rename the new column
ALTER TABLE subscriptions 
RENAME COLUMN plan_new TO plan;

-- Add back the default constraint
ALTER TABLE subscriptions 
ALTER COLUMN plan SET DEFAULT 'free'::plan_type_new;

-- Drop old type
DROP TYPE plan_type;

-- Rename new type to original name
ALTER TYPE plan_type_new RENAME TO plan_type;

-- Now we can safely update admin user's subscription
UPDATE subscriptions 
SET plan = 'admin'
WHERE user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'mikael.nylander84@gmail.com'
);