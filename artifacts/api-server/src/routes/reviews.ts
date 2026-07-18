import { Router } from "express";
import { db, reviewsTable, toolsTable } from "@workspace/db";
import { eq, desc, sql, avg } from "drizzle-orm";
import { requireAuth, getCurrentUser } from "../lib/auth";

const router = Router();

// GET /tools/:toolId/reviews
router.get("/tools/:toolId/reviews", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.toolId) ? req.params.toolId[0] : req.params.toolId;
  const toolId = parseInt(raw, 10);
  if (isNaN(toolId)) { res.status(400).json({ error: "Invalid toolId" }); return; }

  const reviews = await db.select().from(reviewsTable)
    .where(eq(reviewsTable.toolId, toolId))
    .orderBy(desc(reviewsTable.createdAt))
    .limit(50);

  const serialized = reviews.map(serializeReview);
  res.json({ reviews: serialized, total: serialized.length, page: 1, limit: 50 });
});

// POST /tools/:toolId/reviews
router.post("/tools/:toolId/reviews", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.toolId) ? req.params.toolId[0] : req.params.toolId;
  const toolId = parseInt(raw, 10);
  if (isNaN(toolId)) { res.status(400).json({ error: "Invalid toolId" }); return; }

  const user = await getCurrentUser(req);
  const { rating, title, content, pros, cons } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400).json({ error: "rating must be 1-5" });
    return;
  }

  const [review] = await db.insert(reviewsTable).values({
    toolId,
    userId: user!.clerkUserId,
    userName: user!.name ?? null,
    userAvatar: user!.avatarUrl ?? null,
    rating: parseInt(rating),
    title: title ?? null,
    content: content ?? null,
    pros: pros ?? [],
    cons: cons ?? [],
  }).returning();

  await recalculateRating(toolId);
  res.status(201).json(serializeReview(review));
});

// PATCH /reviews/:id
router.patch("/reviews/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const user = await getCurrentUser(req);
  const existing = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id)).limit(1);
  if (existing.length === 0) { res.status(404).json({ error: "Review not found" }); return; }
  if (existing[0].userId !== user?.clerkUserId && user?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const { rating, title, content, pros, cons } = req.body;
  const updateData: Record<string, any> = {};
  if (rating !== undefined) updateData.rating = parseInt(rating);
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (pros !== undefined) updateData.pros = pros;
  if (cons !== undefined) updateData.cons = cons;

  const [updated] = await db.update(reviewsTable).set(updateData).where(eq(reviewsTable.id, id)).returning();
  await recalculateRating(existing[0].toolId);
  res.json(serializeReview(updated));
});

// DELETE /reviews/:id
router.delete("/reviews/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const user = await getCurrentUser(req);
  const existing = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id)).limit(1);
  if (existing.length === 0) { res.status(404).json({ error: "Review not found" }); return; }
  if (existing[0].userId !== user?.clerkUserId && user?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
  await recalculateRating(existing[0].toolId);
  res.sendStatus(204);
});

async function recalculateRating(toolId: number) {
  const result = await db
    .select({ avg: avg(reviewsTable.rating), count: sql<number>`count(*)::int` })
    .from(reviewsTable)
    .where(eq(reviewsTable.toolId, toolId));

  const ratingAvg = parseFloat(result[0]?.avg ?? "0") || 0;
  const reviewCount = result[0]?.count ?? 0;

  await db.update(toolsTable)
    .set({ ratingAvg, reviewCount })
    .where(eq(toolsTable.id, toolId));
}

function serializeReview(review: any) {
  return {
    id: review.id,
    toolId: review.toolId,
    userId: review.userId,
    userName: review.userName,
    userAvatar: review.userAvatar,
    rating: review.rating,
    title: review.title,
    content: review.content,
    pros: review.pros ?? [],
    cons: review.cons ?? [],
    createdAt: review.createdAt?.toISOString?.() ?? review.createdAt,
    updatedAt: review.updatedAt?.toISOString?.() ?? review.updatedAt,
  };
}

export default router;
