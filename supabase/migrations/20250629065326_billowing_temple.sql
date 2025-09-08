/*
  # Fix infinite recursion in admin_users RLS policy

  1. Problem
    - The current RLS policy on admin_users table creates infinite recursion
    - Policy tries to check admin status by querying the same table it's protecting

  2. Solution
    - Drop the problematic policy
    - Create a new policy that allows users to view their own admin record
    - Add a policy for service role access for admin checks

  3. Security
    - Users can only see their own admin record
    - Service role can access all records for admin verification
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admin users are viewable by admins" ON admin_users;

-- Create a policy that allows users to view their own admin record
CREATE POLICY "Users can view their own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create a policy for service role access (used by the application for admin checks)
CREATE POLICY "Service role can access admin users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);