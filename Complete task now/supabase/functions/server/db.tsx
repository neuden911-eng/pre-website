/**
 * Database helper — direct Supabase client for SQL tables.
 * Replaces the old kv_store.tsx approach.
 *
 * Tables:
 *   waitlist  (id, email, name, type, status, created_at)
 *   founders  (id, waitlist_id, company_name, stage, industry, created_at)
 *   investors (id, waitlist_id, firm_name, check_size, focus_area, created_at)
 */
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const supabase = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

// ─── Waitlist helpers ─────────────────────────────────────────────────────────

export interface WaitlistRow {
  id: string;
  email: string;
  name: string | null;
  type: "founder" | "investor";
  status: string;
  created_at: string;
}

/** Insert into waitlist + the appropriate role table. */
export async function addWaitlistEntry(
  email: string,
  role: "founder" | "investor",
  name?: string,
): Promise<WaitlistRow> {
  const client = supabase();

  // Insert into waitlist
  const { data: entry, error } = await client
    .from("waitlist")
    .insert({ email, type: role, name: name ?? null, status: "active" })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Insert into the role-specific table
  if (role === "founder") {
    const { error: fErr } = await client
      .from("founders")
      .insert({ waitlist_id: entry.id });
    if (fErr) console.error("Failed to insert founder row:", fErr.message);
  } else {
    const { error: iErr } = await client
      .from("investors")
      .insert({ waitlist_id: entry.id });
    if (iErr) console.error("Failed to insert investor row:", iErr.message);
  }

  return entry as WaitlistRow;
}

/** Get counts of active waitlist entries by role. */
export async function getWaitlistCounts(): Promise<{
  founders: number;
  investors: number;
  total: number;
}> {
  const client = supabase();

  const { count: founders, error: fErr } = await client
    .from("waitlist")
    .select("*", { count: "exact", head: true })
    .eq("type", "founder")
    .eq("status", "active");
  if (fErr) throw new Error(fErr.message);

  const { count: investors, error: iErr } = await client
    .from("waitlist")
    .select("*", { count: "exact", head: true })
    .eq("type", "investor")
    .eq("status", "active");
  if (iErr) throw new Error(iErr.message);

  return {
    founders: founders ?? 0,
    investors: investors ?? 0,
    total: (founders ?? 0) + (investors ?? 0),
  };
}

/** Get all waitlist entries (for admin). */
export async function getAllEntries(): Promise<WaitlistRow[]> {
  const client = supabase();
  const { data, error } = await client
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as WaitlistRow[];
}

/** Delete a waitlist entry by ID (cascades to founders/investors). */
export async function deleteWaitlistEntry(id: string): Promise<void> {
  const client = supabase();
  const { error } = await client.from("waitlist").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Delete ALL waitlist entries. */
export async function deleteAllEntries(): Promise<number> {
  const client = supabase();
  const { data, error } = await client
    .from("waitlist")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000") // delete all rows
    .select("id");
  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}

/** Toggle status of a waitlist entry. */
export async function updateEntryStatus(
  id: string,
  status: string,
): Promise<WaitlistRow> {
  const client = supabase();
  const { data, error } = await client
    .from("waitlist")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as WaitlistRow;
}

/** Check if email already exists in waitlist. */
export async function emailExists(email: string): Promise<boolean> {
  const client = supabase();
  const { data, error } = await client
    .from("waitlist")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data !== null;
}
