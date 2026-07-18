import { Router } from "express";
import { db, toolsTable, usersTable, reviewsTable, bookmarksTable, reportsTable, newsletterSubscribersTable, blogPostsTable, newsTable } from "@workspace/db";
import { eq, desc, sql, and, inArray } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import { serializeTool } from "./home";

const router = Router();

// All admin routes require admin role
router.use(requireAdmin);

router.get("/admin/stats", async (req, res): Promise<void> => {
  const [toolStats, userCount, reviewCount, bookmarkCount, subscriberCount, recentTools] = await Promise.all([
    db.select({ status: toolsTable.status, count: sql<number>`count(*)::int` })
      .from(toolsTable).groupBy(toolsTable.status),
    db.select({ count: sql<number>`count(*)::int` }).from(usersTable),
    db.select({ count: sql<number>`count(*)::int` }).from(reviewsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(bookmarksTable),
    db.select({ count: sql<number>`count(*)::int` }).from(newsletterSubscribersTable),
    db.select().from(toolsTable).where(eq(toolsTable.status, "pending")).orderBy(desc(toolsTable.createdAt)).limit(5),
  ]);

  const statMap = new Map(toolStats.map((r) => [r.status, r.count]));

  res.json({
    totalTools: toolStats.reduce((sum, r) => sum + r.count, 0),
    pendingTools: statMap.get("pending") ?? 0,
    approvedTools: statMap.get("approved") ?? 0,
    rejectedTools: statMap.get("rejected") ?? 0,
    featuredTools: statMap.get("featured") ?? 0,
    totalUsers: userCount[0]?.count ?? 0,
    totalReviews: reviewCount[0]?.count ?? 0,
    totalBookmarks: bookmarkCount[0]?.count ?? 0,
    totalSubscribers: subscriberCount[0]?.count ?? 0,
    recentTools: recentTools.map((t) => serializeTool(t)),
  });
});

router.get("/admin/tools", async (req, res): Promise<void> => {
  const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const offset = (pageNum - 1) * limitNum;

  const conditions: any[] = [];
  if (status) conditions.push(eq(toolsTable.status, status));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [tools, countResult] = await Promise.all([
    db.select().from(toolsTable).where(where).orderBy(desc(toolsTable.createdAt)).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(toolsTable).where(where),
  ]);

  res.json({ tools: tools.map((t) => serializeTool(t)), total: countResult[0]?.count ?? 0, page: pageNum, limit: limitNum });
});

router.patch("/admin/tools/:id/status", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { status, isVerified, isEditorChoice } = req.body;
  const update: Record<string, any> = {};
  if (status !== undefined) update.status = status;
  if (isVerified !== undefined) update.isVerified = isVerified;
  if (isEditorChoice !== undefined) update.isEditorChoice = isEditorChoice;

  const [tool] = await db.update(toolsTable).set(update).where(eq(toolsTable.id, id)).returning();
  if (!tool) { res.status(404).json({ error: "Tool not found" }); return; }
  res.json(serializeTool(tool));
});

router.get("/admin/users", async (req, res): Promise<void> => {
  const { page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const offset = (pageNum - 1) * limitNum;

  const [users, countResult] = await Promise.all([
    db.select().from(usersTable).orderBy(desc(usersTable.createdAt)).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(usersTable),
  ]);

  res.json({
    users: users.map((u) => ({
      id: u.id, clerkUserId: u.clerkUserId, email: u.email, name: u.name,
      avatarUrl: u.avatarUrl, bio: u.bio, role: u.role,
      createdAt: u.createdAt?.toISOString?.() ?? u.createdAt,
    })),
    total: countResult[0]?.count ?? 0,
    page: pageNum,
    limit: limitNum,
  });
});

router.get("/admin/reports", async (req, res): Promise<void> => {
  const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const offset = (pageNum - 1) * limitNum;

  const conditions: any[] = [];
  if (status) conditions.push(eq(reportsTable.status, status));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [reports, countResult] = await Promise.all([
    db.select().from(reportsTable).where(where).orderBy(desc(reportsTable.createdAt)).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(reportsTable).where(where),
  ]);

  // Enrich with tool data
  const toolIds = [...new Set(reports.map((r) => r.toolId))];
  const tools = toolIds.length > 0 ? await db.select().from(toolsTable).where(inArray(toolsTable.id, toolIds)) : [];
  const toolMap = new Map(tools.map((t) => [t.id, t]));

  const serialized = reports.map((r) => ({
    id: r.id,
    toolId: r.toolId,
    reporterId: r.reporterId,
    reason: r.reason,
    details: r.details,
    status: r.status,
    createdAt: r.createdAt?.toISOString?.() ?? r.createdAt,
    tool: toolMap.get(r.toolId) ? serializeTool(toolMap.get(r.toolId)!) : null,
  }));

  res.json({ reports: serialized, total: countResult[0]?.count ?? 0, page: pageNum, limit: limitNum });
});

router.patch("/admin/reports/:id/status", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { status } = req.body;
  if (!status) { res.status(400).json({ error: "status required" }); return; }

  const [report] = await db.update(reportsTable).set({ status }).where(eq(reportsTable.id, id)).returning();
  if (!report) { res.status(404).json({ error: "Report not found" }); return; }
  res.json({ id: report.id, status: report.status });
});

router.get("/admin/newsletter", async (req, res): Promise<void> => {
  const { page = "1", limit = "50" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(200, parseInt(limit) || 50);
  const offset = (pageNum - 1) * limitNum;

  const [subscribers, countResult] = await Promise.all([
    db.select().from(newsletterSubscribersTable).orderBy(desc(newsletterSubscribersTable.subscribedAt)).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(newsletterSubscribersTable),
  ]);

  res.json({
    subscribers: subscribers.map((s) => ({
      id: s.id,
      email: s.email,
      subscribedAt: s.subscribedAt?.toISOString?.() ?? s.subscribedAt,
    })),
    total: countResult[0]?.count ?? 0,
    page: pageNum,
    limit: limitNum,
  });
});

export default router;
