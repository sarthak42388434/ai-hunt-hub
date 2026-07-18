import { Router } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq, desc, sql, and } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import { serializeBlogPost } from "./home";

const router = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const { category, page = "1", limit = "10" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, parseInt(limit) || 10);
  const offset = (pageNum - 1) * limitNum;

  const conditions: any[] = [eq(blogPostsTable.status, "published")];
  if (category) conditions.push(eq(blogPostsTable.category, category));

  const [posts, countResult] = await Promise.all([
    db.select().from(blogPostsTable).where(and(...conditions))
      .orderBy(desc(blogPostsTable.publishedAt)).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(blogPostsTable).where(and(...conditions)),
  ]);

  res.json({ posts: posts.map(serializeBlogPost), total: countResult[0]?.count ?? 0, page: pageNum, limit: limitNum });
});

router.post("/blog", requireAdmin, async (req, res): Promise<void> => {
  const { title, slug, excerpt, content, authorName, authorAvatar, category, tags, coverImage, status } = req.body;
  if (!title || !slug || !excerpt) { res.status(400).json({ error: "title, slug, excerpt required" }); return; }

  const publishedAt = status === "published" ? new Date() : null;
  const [post] = await db.insert(blogPostsTable).values({
    title, slug, excerpt, content: content ?? null, authorName: authorName ?? null,
    authorAvatar: authorAvatar ?? null, category: category ?? null, tags: tags ?? [],
    coverImage: coverImage ?? null, status: status ?? "draft",
    publishedAt,
    readingTime: Math.ceil((content?.split(" ")?.length ?? 0) / 200) || 5,
  }).returning();

  res.status(201).json(serializeBlogPost(post));
});

router.get("/blog/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [post] = await db.select().from(blogPostsTable)
    .where(and(eq(blogPostsTable.slug, slug), eq(blogPostsTable.status, "published")))
    .limit(1);

  if (!post) { res.status(404).json({ error: "Not found" }); return; }
  res.json(serializeBlogPost(post));
});

router.patch("/blog/id/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { title, slug, excerpt, content, authorName, authorAvatar, category, tags, coverImage, status } = req.body;
  const update: Record<string, any> = {};
  if (title !== undefined) update.title = title;
  if (slug !== undefined) update.slug = slug;
  if (excerpt !== undefined) update.excerpt = excerpt;
  if (content !== undefined) { update.content = content; update.readingTime = Math.ceil((content?.split(" ")?.length ?? 0) / 200) || 5; }
  if (authorName !== undefined) update.authorName = authorName;
  if (authorAvatar !== undefined) update.authorAvatar = authorAvatar;
  if (category !== undefined) update.category = category;
  if (tags !== undefined) update.tags = tags;
  if (coverImage !== undefined) update.coverImage = coverImage;
  if (status !== undefined) { update.status = status; if (status === "published") update.publishedAt = new Date(); }

  const [post] = await db.update(blogPostsTable).set(update).where(eq(blogPostsTable.id, id)).returning();
  if (!post) { res.status(404).json({ error: "Not found" }); return; }
  res.json(serializeBlogPost(post));
});

router.delete("/blog/id/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.sendStatus(204);
});

export default router;
