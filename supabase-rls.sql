-- Enable Row Level Security (RLS) for the 'ventas' table.
-- This is required for Supabase Realtime to work.
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists, to ensure a clean setup.
DROP POLICY IF EXISTS "Allow authenticated users to read all sales" ON public.ventas;

-- Create a new policy that allows any authenticated user to select (read) all records from the 'ventas' table.
-- Supabase Realtime uses the authenticated user's role to check SELECT policies.
CREATE POLICY "Allow authenticated users to read all sales"
ON public.ventas
FOR SELECT
TO authenticated
USING (true);
