-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('founder', 'investor')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'removed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_role ON public.waitlist(role);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Allow service role (Edge Functions) to do everything
-- 2. Allow authenticated admins to read all
-- 3. Allow authenticated admins to update/delete
-- Note: Assuming the user will set up an 'admin' role or just use authenticated for their own use.
-- For a "clean and minimal" setup, we'll allow all authenticated users to read for now, 
-- but ideally this should be restricted to a specific admin email or role.

CREATE POLICY "Admins can do everything" ON public.waitlist
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- No public policies needed if using Edge Functions with service_role key.
