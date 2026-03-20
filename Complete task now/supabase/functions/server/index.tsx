import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import {
  addWaitlistEntry,
  getWaitlistCounts,
  getAllEntries,
  deleteWaitlistEntry,
  deleteAllEntries,
  updateEntryStatus,
  emailExists,
} from "./db.tsx";

const app = new Hono();

app.use("*", logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Password"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Explicitly handle OPTIONS for all routes if needed (though Hono's cors middleware usually handles it)
app.options("*", (c) => c.text("", 204));

// Helper: check admin password from header
function isAdmin(c: any): boolean {
  const pw = c.req.header("X-Admin-Password");
  const expected = Deno.env.get("ADMIN_PASSWORD");
  if (!expected || !pw) return false;
  return pw === expected;
}

// Health check
app.get("/make-server-addddf28/health", (c) => {
  return c.json({ status: "ok" });
});

// ──────────────────── PUBLIC ROUTES ────────────────────

// POST /waitlist — signup
app.post("/make-server-addddf28/waitlist", async (c) => {
  try {
    const { email, role } = await c.req.json();
    if (!email || !role) {
      return c.json({ error: "Email and role are required" }, 400);
    }
    const normalizedRole = role.toLowerCase();
    if (normalizedRole !== "founder" && normalizedRole !== "investor") {
      return c.json({ error: "Role must be founder or investor" }, 400);
    }

    // Check for duplicate email
    const exists = await emailExists(email);
    if (exists) {
      return c.json({ error: "Email already registered" }, 409);
    }

    const entry = await addWaitlistEntry(email, normalizedRole);
    console.log(`Waitlist signup: ${email} as ${normalizedRole}`);
    return c.json({ success: true, id: entry.id });
  } catch (err) {
    console.log(`Error in POST /waitlist: ${err}`);
    return c.json({ error: `Failed to add to waitlist: ${err}` }, 500);
  }
});

// GET /waitlist/counts — public counts
app.get("/make-server-addddf28/waitlist/counts", async (c) => {
  try {
    const counts = await getWaitlistCounts();
    return c.json(counts);
  } catch (err) {
    console.log(`Error in GET /waitlist/counts: ${err}`);
    return c.json({ error: `Failed to get counts: ${err}` }, 500);
  }
});

// ──────────────────── ADMIN ROUTES ────────────────────

// POST /admin/login — verify password
app.post("/make-server-addddf28/admin/login", (c) => {
  try {
    if (!isAdmin(c)) {
      return c.json({ error: "Invalid admin password" }, 401);
    }
    return c.json({ success: true });
  } catch (err) {
    console.log(`Error in POST /admin/login: ${err}`);
    return c.json({ error: `Admin login failed: ${err}` }, 500);
  }
});

// GET /admin/entries — list all waitlist entries
app.get("/make-server-addddf28/admin/entries", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  try {
    const entries = await getAllEntries();
    // Map to the shape expected by the frontend AdminPanel
    const mapped = entries.map((e) => ({
      id: e.id,
      email: e.email,
      role: e.type,         // DB uses "type", frontend expects "role"
      created_at: e.created_at,
      status: e.status ?? "active",
    }));
    return c.json({ entries: mapped });
  } catch (err) {
    console.log(`Error in GET /admin/entries: ${err}`);
    return c.json({ error: `Failed to list entries: ${err}` }, 500);
  }
});

// POST /admin/entries — manually add entry
app.post("/make-server-addddf28/admin/entries", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { email, role } = await c.req.json();
    if (!email || !role)
      return c.json({ error: "Email and role required" }, 400);

    const entry = await addWaitlistEntry(email, role.toLowerCase());
    return c.json({
      success: true,
      entry: {
        id: entry.id,
        email: entry.email,
        role: entry.type,
        created_at: entry.created_at,
        status: entry.status,
      },
    });
  } catch (err) {
    console.log(`Error in POST /admin/entries: ${err}`);
    return c.json({ error: `Failed to add entry: ${err}` }, 500);
  }
});

// DELETE /admin/entries/:id — delete entry
app.delete("/make-server-addddf28/admin/entries/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  try {
    const id = c.req.param("id");
    await deleteWaitlistEntry(id);
    return c.json({ success: true });
  } catch (err) {
    console.log(`Error in DELETE /admin/entries: ${err}`);
    return c.json({ error: `Failed to delete entry: ${err}` }, 500);
  }
});

// POST /admin/reset — delete all waitlist entries
app.post("/make-server-addddf28/admin/reset", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  try {
    const deleted = await deleteAllEntries();
    return c.json({ success: true, deleted });
  } catch (err) {
    console.log(`Error in POST /admin/reset: ${err}`);
    return c.json({ error: `Failed to reset: ${err}` }, 500);
  }
});

// PATCH /admin/entries/:id/status — toggle status
app.patch("/make-server-addddf28/admin/entries/:id/status", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    const updated = await updateEntryStatus(id, status);
    return c.json({
      success: true,
      entry: {
        id: updated.id,
        email: updated.email,
        role: updated.type,
        created_at: updated.created_at,
        status: updated.status,
      },
    });
  } catch (err) {
    console.log(`Error in PATCH /admin/entries status: ${err}`);
    return c.json({ error: `Failed to update status: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);
