import { Router } from "express";
import { db, toolsTable, categoriesTable, reportsTable } from "@workspace/db";
import { eq, desc, asc, ilike, and, gte, inArray, sql, or } from "drizzle-orm";
import { requireAuth, requireAdmin, getCurrentUser } from "../lib/auth";
import { serializeTool } from "./home";

const router = Router();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") + "-" + Date.now();
}

async function enrichToolsWithCategory(tools: any[]) {
  if (tools.length === 0) return tools;
  const catIds = [...new Set(tools.map((t) => t.categoryId).filter(Boolean))];
  let catMap = new Map<number, any>();
  if (catIds.length > 0) {
    const cats = await db.select().from(categoriesTable).where(inArray(categoriesTable.id, catIds as number[]));
    cats.forEach((c) => catMap.set(c.id, c));
  }
  return tools.map((t) => {
    const cat = t.categoryId ? catMap.get(t.categoryId) : null;
    return serializeTool(t, cat?.name ?? null, cat?.slug ?? null);
  });
}

// GET /tools - list and search
router.get("/tools", async (req, res): Promise<void> => {
  const { search, category, pricing, platform, rating, tag, sort = "newest", verified, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [inArray(toolsTable.status, ["approved", "featured"])];

  if (search) {
    conditions.push(
      or(
        ilike(toolsTable.name, `%${search}%`),
        ilike(toolsTable.shortDescription, `%${search}%`),
      )!
    );
  }

  if (pricing) conditions.push(eq(toolsTable.pricing, pricing));
  if (verified === "true") conditions.push(eq(toolsTable.isVerified, true));
  if (rating) conditions.push(gte(toolsTable.ratingAvg, parseFloat(rating)));

  let categoryId: number | null = null;
  if (category) {
    const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, category)).limit(1);
    if (cat.length > 0) {
      categoryId = cat[0].id;
      conditions.push(eq(toolsTable.categoryId, categoryId));
    }
  }

  const orderBy = sort === "popular" ? desc(toolsTable.views) :
    sort === "rating" ? desc(toolsTable.ratingAvg) :
    sort === "alphabetical" ? asc(toolsTable.name) :
    desc(toolsTable.createdAt);

  const [tools, countResult] = await Promise.all([
    db.select().from(toolsTable).where(and(...conditions)).orderBy(orderBy).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(toolsTable).where(and(...conditions)),
  ]);

  const enriched = await enrichToolsWithCategory(tools);
  // Tag filter (in-memory since tags is an array column)
  const filtered = tag ? enriched.filter((t: any) => t.tags?.includes(tag)) : enriched;

  res.json({ tools: filtered, total: countResult[0]?.count ?? 0, page: pageNum, limit: limitNum });
});

// GET /tools/featured
router.get("/tools/featured", async (req, res): Promise<void> => {
  const limit = Math.min(50, parseInt(req.query.limit as string) || 8);
  const tools = await db.select().from(toolsTable)
    .where(eq(toolsTable.status, "featured"))
    .orderBy(desc(toolsTable.trendingScore))
    .limit(limit);
  res.json((await enrichToolsWithCategory(tools)));
});

// GET /tools/trending
router.get("/tools/trending", async (req, res): Promise<void> => {
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
  const tools = await db.select().from(toolsTable)
    .where(inArray(toolsTable.status, ["approved", "featured"]))
    .orderBy(desc(toolsTable.trendingScore), desc(toolsTable.views))
    .limit(limit);
  res.json((await enrichToolsWithCategory(tools)));
});

// GET /tools/newest
router.get("/tools/newest", async (req, res): Promise<void> => {
  const limit = Math.min(50, parseInt(req.query.limit as string) || 12);
  const tools = await db.select().from(toolsTable)
    .where(inArray(toolsTable.status, ["approved", "featured"]))
    .orderBy(desc(toolsTable.createdAt))
    .limit(limit);
  res.json((await enrichToolsWithCategory(tools)));
});

// GET /tools/free
router.get("/tools/free", async (req, res): Promise<void> => {
  const limit = Math.min(50, parseInt(req.query.limit as string) || 12);
  const tools = await db.select().from(toolsTable)
    .where(and(eq(toolsTable.pricing, "free"), inArray(toolsTable.status, ["approved", "featured"])))
    .orderBy(desc(toolsTable.trendingScore))
    .limit(limit);
  res.json((await enrichToolsWithCategory(tools)));
});

// GET /tools/editors-choice
router.get("/tools/editors-choice", async (req, res): Promise<void> => {
  const limit = Math.min(50, parseInt(req.query.limit as string) || 6);
  const tools = await db.select().from(toolsTable)
    .where(and(eq(toolsTable.isEditorChoice, true), inArray(toolsTable.status, ["approved", "featured"])))
    .orderBy(desc(toolsTable.trendingScore))
    .limit(limit);
  res.json((await enrichToolsWithCategory(tools)));
});

// GET /tools/compare
router.get("/tools/compare", async (req, res): Promise<void> => {
  const { ids } = req.query as { ids: string };
  if (!ids) { res.status(400).json({ error: "ids required" }); return; }
  const idList = ids.split(",").map((id) => parseInt(id)).filter((n) => !isNaN(n)).slice(0, 3);
  if (idList.length === 0) { res.status(400).json({ error: "Invalid ids" }); return; }
  const tools = await db.select().from(toolsTable).where(inArray(toolsTable.id, idList));
  res.json((await enrichToolsWithCategory(tools)));
});

// POST /tools - submit
router.post("/tools", requireAuth, async (req, res): Promise<void> => {
  const user = await getCurrentUser(req);
  const { name, websiteUrl, shortDescription, longDescription, logoUrl, bannerUrl, demoVideoUrl,
    categoryId, pricing, aiModel, features, pros, cons, platforms, integrations, tags, screenshots,
    socialLinks, ownerName, contactEmail, supportUrl, documentationUrl, githubUrl, launchDate } = req.body;

  if (!name || !websiteUrl || !shortDescription) {
    res.status(400).json({ error: "name, websiteUrl, and shortDescription are required" });
    return;
  }

  const slug = slugify(name);
  const [tool] = await db.insert(toolsTable).values({
    name, slug, websiteUrl, shortDescription, longDescription: longDescription ?? null,
    logoUrl: logoUrl ?? null, bannerUrl: bannerUrl ?? null, demoVideoUrl: demoVideoUrl ?? null,
    categoryId: categoryId ?? null, pricing: pricing ?? "free", status: "pending",
    aiModel: aiModel ?? null, features: features ?? [], pros: pros ?? [], cons: cons ?? [],
    platforms: platforms ?? [], integrations: integrations ?? [], tags: tags ?? [],
    screenshots: screenshots ?? [], socialLinks: socialLinks ?? null,
    ownerName: ownerName ?? null, contactEmail: contactEmail ?? null,
    supportUrl: supportUrl ?? null, documentationUrl: documentationUrl ?? null,
    githubUrl: githubUrl ?? null, launchDate: launchDate ?? null,
    submittedBy: user?.clerkUserId ?? null,
  }).returning();

  const enriched = await enrichToolsWithCategory([tool]);
  res.status(201).json(enriched[0]);
});

// GET /tools/:id
router.get("/tools/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const tools = await db.select().from(toolsTable).where(eq(toolsTable.id, id)).limit(1);
  if (tools.length === 0) { res.status(404).json({ error: "Tool not found" }); return; }

  const enriched = await enrichToolsWithCategory(tools);
  res.json(enriched[0]);
});

// PATCH /tools/:id
router.patch("/tools/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const allowedFields = ["name", "websiteUrl", "shortDescription", "longDescription", "logoUrl",
    "bannerUrl", "demoVideoUrl", "categoryId", "pricing", "isVerified", "isEditorChoice",
    "aiModel", "features", "pros", "cons", "platforms", "integrations", "tags", "screenshots",
    "socialLinks", "ownerName", "contactEmail", "supportUrl", "documentationUrl", "githubUrl", "launchDate"];
  const updateData: Record<string, any> = {};
  for (const field of allowedFields) {
    if (field in req.body) updateData[field] = req.body[field];
  }

  const [tool] = await db.update(toolsTable).set(updateData).where(eq(toolsTable.id, id)).returning();
  if (!tool) { res.status(404).json({ error: "Tool not found" }); return; }

  const enriched = await enrichToolsWithCategory([tool]);
  res.json(enriched[0]);
});

// DELETE /tools/:id
router.delete("/tools/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(toolsTable).where(eq(toolsTable.id, id));
  res.sendStatus(204);
});

// GET /tools/:id/related
router.get("/tools/:id/related", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [current] = await db.select().from(toolsTable).where(eq(toolsTable.id, id)).limit(1);
  if (!current) { res.json([]); return; }

  const conditions: any[] = [inArray(toolsTable.status, ["approved", "featured"])];
  if (current.categoryId) conditions.push(eq(toolsTable.categoryId, current.categoryId));

  const related = await db.select().from(toolsTable)
    .where(and(...conditions))
    .orderBy(desc(toolsTable.trendingScore))
    .limit(7);

  const filtered = related.filter((t) => t.id !== id).slice(0, 6);
  res.json((await enrichToolsWithCategory(filtered)));
});

// POST /tools/:id/view
router.post("/tools/:id/view", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.sendStatus(204); return; }

  await db.update(toolsTable)
    .set({ views: sql`${toolsTable.views} + 1`, trendingScore: sql`${toolsTable.trendingScore} + 0.1` })
    .where(eq(toolsTable.id, id));
  res.sendStatus(204);
});

// POST /tools/:id/click
router.post("/tools/:id/click", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.sendStatus(204); return; }

  await db.update(toolsTable)
    .set({ clicks: sql`${toolsTable.clicks} + 1`, trendingScore: sql`${toolsTable.trendingScore} + 0.5` })
    .where(eq(toolsTable.id, id));
  res.sendStatus(204);
});

// POST /tools/:id/report
router.post("/tools/:id/report", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const user = await getCurrentUser(req);
  const { reason, details } = req.body;
  if (!reason) { res.status(400).json({ error: "reason is required" }); return; }

  await db.insert(reportsTable).values({
    reporterId: user?.clerkUserId ?? null,
    toolId: id,
    reason,
    details: details ?? null,
    status: "open",
  });
  res.sendStatus(201);
});

export default router;
