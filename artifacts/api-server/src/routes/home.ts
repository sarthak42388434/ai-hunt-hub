import { Router } from "express";
import { db, toolsTable, categoriesTable, blogPostsTable, newsTable, usersTable, reviewsTable, bookmarksTable } from "@workspace/db";
import { eq, desc, sql, and, inArray } from "drizzle-orm";

const router = Router();

router.get("/home", async (req, res): Promise<void> => {
  const [
    featuredTools,
    trendingTools,
    newestTools,
    topRatedTools,
    freeTools,
    editorsChoice,
    categories,
    recentBlogPosts,
    recentNews,
    toolCount,
    userCount,
    reviewCount,
  ] = await Promise.all([
    db.select().from(toolsTable)
      .where(eq(toolsTable.status, "featured"))
      .orderBy(desc(toolsTable.trendingScore))
      .limit(8),
    db.select().from(toolsTable)
      .where(inArray(toolsTable.status, ["approved", "featured"]))
      .orderBy(desc(toolsTable.trendingScore))
      .limit(10),
    db.select().from(toolsTable)
      .where(inArray(toolsTable.status, ["approved", "featured"]))
      .orderBy(desc(toolsTable.createdAt))
      .limit(12),
    db.select().from(toolsTable)
      .where(inArray(toolsTable.status, ["approved", "featured"]))
      .orderBy(desc(toolsTable.ratingAvg))
      .limit(8),
    db.select().from(toolsTable)
      .where(and(eq(toolsTable.pricing, "free"), inArray(toolsTable.status, ["approved", "featured"])))
      .orderBy(desc(toolsTable.trendingScore))
      .limit(12),
    db.select().from(toolsTable)
      .where(and(eq(toolsTable.isEditorChoice, true), inArray(toolsTable.status, ["approved", "featured"])))
      .orderBy(desc(toolsTable.trendingScore))
      .limit(6),
    db.select().from(categoriesTable).orderBy(categoriesTable.sortOrder),
    db.select().from(blogPostsTable)
      .where(eq(blogPostsTable.status, "published"))
      .orderBy(desc(blogPostsTable.publishedAt))
      .limit(4),
    db.select().from(newsTable)
      .orderBy(desc(newsTable.publishedAt))
      .limit(4),
    db.select({ count: sql<number>`count(*)::int` }).from(toolsTable)
      .where(inArray(toolsTable.status, ["approved", "featured"])),
    db.select({ count: sql<number>`count(*)::int` }).from(usersTable),
    db.select({ count: sql<number>`count(*)::int` }).from(reviewsTable),
  ]);

  // Build category tool counts
  const toolCountsByCategory = await db
    .select({ categoryId: toolsTable.categoryId, count: sql<number>`count(*)::int` })
    .from(toolsTable)
    .where(inArray(toolsTable.status, ["approved", "featured"]))
    .groupBy(toolsTable.categoryId);

  const countMap = new Map(toolCountsByCategory.map((r) => [r.categoryId, r.count]));

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    toolCount: countMap.get(cat.id) ?? 0,
  }));

  res.json({
    featuredTools: featuredTools.map(serializeTool),
    trendingTools: trendingTools.map(serializeTool),
    newestTools: newestTools.map(serializeTool),
    topRatedTools: topRatedTools.map(serializeTool),
    freeTools: freeTools.map(serializeTool),
    editorsChoice: editorsChoice.map(serializeTool),
    categories: categoriesWithCount,
    recentBlogPosts: recentBlogPosts.map(serializeBlogPost),
    recentNews: recentNews.map(serializeNews),
    stats: {
      totalTools: toolCount[0]?.count ?? 0,
      totalCategories: categories.length,
      totalUsers: userCount[0]?.count ?? 0,
      totalReviews: reviewCount[0]?.count ?? 0,
    },
  });
});

export function serializeTool(tool: any, categoryName?: string | null, categorySlug?: string | null) {
  return {
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    websiteUrl: tool.websiteUrl,
    shortDescription: tool.shortDescription,
    longDescription: tool.longDescription,
    logoUrl: tool.logoUrl,
    bannerUrl: tool.bannerUrl,
    demoVideoUrl: tool.demoVideoUrl,
    categoryId: tool.categoryId,
    categoryName: categoryName ?? tool.categoryName ?? null,
    categorySlug: categorySlug ?? tool.categorySlug ?? null,
    pricing: tool.pricing,
    status: tool.status,
    isVerified: tool.isVerified,
    isEditorChoice: tool.isEditorChoice,
    views: tool.views,
    clicks: tool.clicks,
    bookmarkCount: tool.bookmarkCount,
    ratingAvg: tool.ratingAvg,
    reviewCount: tool.reviewCount,
    ownerName: tool.ownerName,
    contactEmail: tool.contactEmail,
    supportUrl: tool.supportUrl,
    documentationUrl: tool.documentationUrl,
    githubUrl: tool.githubUrl,
    launchDate: tool.launchDate,
    aiModel: tool.aiModel,
    features: tool.features ?? [],
    pros: tool.pros ?? [],
    cons: tool.cons ?? [],
    platforms: tool.platforms ?? [],
    integrations: tool.integrations ?? [],
    tags: tool.tags ?? [],
    screenshots: tool.screenshots ?? [],
    socialLinks: tool.socialLinks ?? {},
    submittedBy: tool.submittedBy,
    trendingScore: tool.trendingScore,
    createdAt: tool.createdAt?.toISOString?.() ?? tool.createdAt,
    updatedAt: tool.updatedAt?.toISOString?.() ?? tool.updatedAt,
  };
}

export function serializeBlogPost(post: any) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    authorName: post.authorName,
    authorAvatar: post.authorAvatar,
    category: post.category,
    tags: post.tags ?? [],
    readingTime: post.readingTime,
    coverImage: post.coverImage,
    status: post.status,
    publishedAt: post.publishedAt?.toISOString?.() ?? post.publishedAt,
    createdAt: post.createdAt?.toISOString?.() ?? post.createdAt,
    updatedAt: post.updatedAt?.toISOString?.() ?? post.updatedAt,
  };
}

export function serializeNews(article: any) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    sourceUrl: article.sourceUrl,
    category: article.category,
    coverImage: article.coverImage,
    isTrending: article.isTrending,
    publishedAt: article.publishedAt?.toISOString?.() ?? article.publishedAt,
    createdAt: article.createdAt?.toISOString?.() ?? article.createdAt,
  };
}

export default router;
