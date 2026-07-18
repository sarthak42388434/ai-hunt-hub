import { Router } from "express";
import { db, usersTable, toolsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, getCurrentUser } from "../lib/auth";
import { serializeTool } from "./home";

const router = Router();

router.get("/users/me", requireAuth, async (req, res): Promise<void> => {
  const user = await getCurrentUser(req);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(serializeUser(user));
});

router.patch("/users/me", requireAuth, async (req, res): Promise<void> => {
  const user = await getCurrentUser(req);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  const { name, bio, avatarUrl } = req.body;
  const update: Record<string, any> = {};
  if (name !== undefined) update.name = name;
  if (bio !== undefined) update.bio = bio;
  if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;

  const [updated] = await db.update(usersTable).set(update).where(eq(usersTable.id, user.id)).returning();
  res.json(serializeUser(updated));
});

router.get("/users/me/submitted-tools", requireAuth, async (req, res): Promise<void> => {
  const user = await getCurrentUser(req);
  if (!user) { res.json([]); return; }

  const tools = await db.select().from(toolsTable).where(eq(toolsTable.submittedBy, user.clerkUserId));
  res.json(tools.map((t) => serializeTool(t)));
});

function serializeUser(user: any) {
  return {
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    role: user.role,
    createdAt: user.createdAt?.toISOString?.() ?? user.createdAt,
  };
}

export default router;
