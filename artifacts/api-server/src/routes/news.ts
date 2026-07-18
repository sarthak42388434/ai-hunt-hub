import { Router } from "express";
import { db, newsTable } from "@workspace/db";
import { eq, desc, sql, and } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import { serializeNews } from "./home";

const router = Router();

router.get("/news", async (req, res): Promise<void> => {
  const { category, trending, page = "1", limit = "10" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, parseInt(limit) || 10);
  const offset = (pageNum - 1) * limitNum;

  const conditions: any[] = [];
  if (category) conditions.push(eq(newsTable.category, category));
  if (trending === "true") conditions.push(eq(newsTable.isTrending, true));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [articles, countResult] = await Promise.all([
    db.select().from(newsTable).where(where).orderBy(desc(newsTable.publishedAt)).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(newsTable).where(where),
  ]);

  res.json({ articles: articles.map(serializeNews), total: countResult[0]?.count ?? 0, page: pageNum, limit: limitNum });
});

router.post("/news", requireAdmin, async (req, res): Promise<void> => {
  const { title, slug, excerpt, content, sourceUrl, category, coverImage, isTrending, publishedAt } = req.body;
  if (!title || !slug || !excerpt) { res.status(400).json({ error: "title, slug, excerpt required" }); return; }

  const [article] = await db.insert(newsTable).values({
    title, slug, excerpt, content: content ?? null, sourceUrl: sourceUrl ?? null,
    category: category ?? null, coverImage: coverImage ?? null, isTrending: isTrending ?? false,
    publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
  }).returning();

  res.status(201).json(serializeNews(article));
});

router.get("/news/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [article] = await db.select().from(newsTable).where(eq(newsTable.slug, slug)).limit(1);
  if (!article) { res.status(404).json({ error: "Not found" }); return; }
  res.json(serializeNews(article));
});

router.patch("/news/id/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { title, excerpt, content, sourceUrl, category, coverImage, isTrending } = req.body;
  const update: Record<string, any> = {};
  if (title !== undefined) update.title = title;
  if (excerpt !== undefined) update.excerpt = excerpt;
  if (content !== undefined) update.content = content;
  if (sourceUrl !== undefined) update.sourceUrl = sourceUrl;
  if (category !== undefined) update.category = category;
  if (coverImage !== undefined) update.coverImage = coverImage;
  if (isTrending !== undefined) update.isTrending = isTrending;

  const [article] = await db.update(newsTable).set(update).where(eq(newsTable.id, id)).returning();
  if (!article) { res.status(404).json({ error: "Not found" }); return; }
  res.json(serializeNews(article));
});

export default router;
