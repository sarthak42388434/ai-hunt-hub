import { Router } from "express";
import { db, categoriesTable, toolsTable } from "@workspace/db";
import { eq, desc, sql, inArray } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router = Router();

router.get("/categories", async (req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.sortOrder);

  const toolCounts = await db
    .select({ categoryId: toolsTable.categoryId, count: sql<number>`count(*)::int` })
    .from(toolsTable)
    .where(inArray(toolsTable.status, ["approved", "featured"]))
    .groupBy(toolsTable.categoryId);

  const countMap = new Map(toolCounts.map((r) => [r.categoryId, r.count]));

  res.json(cats.map((c) => ({ ...c, toolCount: countMap.get(c.id) ?? 0 })));
});

router.post("/categories", requireAdmin, async (req, res): Promise<void> => {
  const { name, slug, description, icon } = req.body;
  if (!name || !slug) { res.status(400).json({ error: "name and slug required" }); return; }

  const [cat] = await db.insert(categoriesTable).values({ name, slug, description: description ?? null, icon: icon ?? null }).returning();
  res.status(201).json({ ...cat, toolCount: 0 });
});

router.patch("/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { name, slug, description, icon } = req.body;
  const update: Record<string, any> = {};
  if (name !== undefined) update.name = name;
  if (slug !== undefined) update.slug = slug;
  if (description !== undefined) update.description = description;
  if (icon !== undefined) update.icon = icon;

  const [cat] = await db.update(categoriesTable).set(update).where(eq(categoriesTable.id, id)).returning();
  if (!cat) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...cat, toolCount: 0 });
});

router.delete("/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  res.sendStatus(204);
});

export default router;
