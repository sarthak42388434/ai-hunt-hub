import { Router } from "express";
import { db, tagsTable, toolsTable } from "@workspace/db";
import { sql, inArray } from "drizzle-orm";

const router = Router();

router.get("/tags", async (req, res): Promise<void> => {
  // Get all unique tags from tools with their counts
  const result = await db
    .select({ tags: toolsTable.tags })
    .from(toolsTable)
    .where(inArray(toolsTable.status, ["approved", "featured"]));

  const tagCounts = new Map<string, number>();
  for (const row of result) {
    for (const tag of (row.tags ?? [])) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const tags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map((entry, i) => ({
      id: i + 1,
      name: entry[0],
      slug: entry[0].toLowerCase().replace(/\s+/g, "-"),
      toolCount: entry[1],
    }));

  res.json(tags);
});

export default router;
