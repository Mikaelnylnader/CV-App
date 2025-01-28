/*
  # Blog Posts Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `content` (jsonb) - Stores sections and FAQ data
      - `excerpt` (text)
      - `author` (text)
      - `author_role` (text)
      - `image_url` (text)
      - `read_time` (text)
      - `published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `published_at` (timestamptz)
      - `slug` (text, unique)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for public read access
    - Add policies for admin write access
*/

-- Create blog_posts table
CREATE TABLE blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    content jsonb NOT NULL,
    excerpt text,
    author text NOT NULL,
    author_role text,
    image_url text,
    read_time text,
    published boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    published_at timestamptz,
    slug text UNIQUE NOT NULL
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access for published posts"
    ON blog_posts
    FOR SELECT
    USING (published = true);

CREATE POLICY "Allow admin full access"
    ON blog_posts
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE email IN ('admin@example.com')
    ))
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE email IN ('admin@example.com')
    ));

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_blog_post_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamp updates
CREATE TRIGGER update_blog_post_timestamp
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_post_timestamp();