import { Router } from "express";
import { db, bookmarksTable, toolsTable } from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";
import { requireAuth, getCurrentUser } from "../lib/auth";
import { serializeTool } from "./home";

const router = Router();

router.get("/bookmarks", requireAuth, async (req, res): Promise<void> => {
  const user = await getCurrentUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const bkmarks = await db.select().from(bookmarksTable)
    .where(eq(bookmarksTable.userId, user.clerkUserId));

  if (bkmarks.length === 0) { res.json([]); return; }

  const toolIds = bkmarks.map((b) => b.toolId);
  const tools = await db.select().from(toolsTable).where(inArray(toolsTable.id, toolIds));
  const toolMap = new Map(tools.map((t) => [t.id, t]));

  const result = bkmarks.map((b) => {
    const tool = toolMap.get(b.toolId);
    return {
      id: b.id,
      toolId: b.toolId,
      userId: b.userId,
      tool: tool ? serializeTool(tool) : null,
      createdAt: b.createdAt?.toISOString?.() ?? b.createdAt,
    };
  });

  res.json(result);
});

router.post("/bookmarks", requireAuth, async (req, res): Promise<void> => {
  const user = await getCurrentUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { toolId } = req.body;
  if (!toolId) { res.status(400).json({ error: "toolId required" }); return; }

  const existing = await db.select().from(bookmarksTable)
    .where(and(eq(bookmarksTable.userId, user.clerkUserId), eq(bookmarksTable.toolId, toolId)))
    .limit(1);

  if (existing.length > 0) { res.status(201).json(existing[0]); return; }

  const [bk] = await db.insert(bookmarksTable)
    .values({ userId: user.clerkUserId, toolId })
    .returning();

  // Increment bookmark count
  await db.execute(`UPDATE tools SET bookmark_count = bookmark_count + 1 WHERE id = ${toolId}`);

  res.status(201).json({ id: bk.id, toolId: bk.toolId, userId: bk.userId, createdAt: bk.createdAt?.toISOString?.() });
});

router.delete("/bookmarks/:toolId", requireAuth, async (req, res): Promise<void> => {
  const user = await getCurrentUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const raw = Array.isArray(req.params.toolId) ? req.params.toolId[0] : req.params.toolId;
  const toolId = parseInt(raw, 10);
  if (isNaN(toolId)) { res.status(400).json({ error: "Invalid toolId" }); return; }

  await db.delete(bookmarksTable)
    .where(and(eq(bookmarksTable.userId, user.clerkUserId), eq(bookmarksTable.toolId, toolId)));

  await db.execute(`UPDATE tools SET bookmark_count = GREATEST(bookmark_count - 1, 0) WHERE id = ${toolId}`);
  res.sendStatus(204);
});

router.get("/bookmarks/check/:toolId", async (req, res): Promise<void> => {
  const user = await getCurrentUser(req);
  if (!user) { res.json({ bookmarked: false }); return; }

  const raw = Array.isArray(req.params.toolId) ? req.params.toolId[0] : req.params.toolId;
  const toolId = parseInt(raw, 10);
  if (isNaN(toolId)) { res.json({ bookmarked: false }); return; }

  const existing = await db.select().from(bookmarksTable)
    .where(and(eq(bookmarksTable.userId, user.clerkUserId), eq(bookmarksTable.toolId, toolId)))
    .limit(1);

  res.json({ bookmarked: existing.length > 0 });
});

export default router;
