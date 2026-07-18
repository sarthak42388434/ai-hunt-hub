import { pgTable, serial, text, integer, boolean, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const toolsTable = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  websiteUrl: text("website_url").notNull(),
  shortDescription: text("short_description").notNull(),
  longDescription: text("long_description"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  demoVideoUrl: text("demo_video_url"),
  categoryId: integer("category_id"),
  pricing: text("pricing").notNull().default("free"), // free | freemium | paid | contact
  status: text("status").notNull().default("pending"), // pending | approved | rejected | featured
  isVerified: boolean("is_verified").notNull().default(false),
  isEditorChoice: boolean("is_editor_choice").notNull().default(false),
  views: integer("views").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  bookmarkCount: integer("bookmark_count").notNull().default(0),
  ratingAvg: real("rating_avg").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  trendingScore: real("trending_score").notNull().default(0),
  ownerName: text("owner_name"),
  contactEmail: text("contact_email"),
  supportUrl: text("support_url"),
  documentationUrl: text("documentation_url"),
  githubUrl: text("github_url"),
  launchDate: text("launch_date"),
  aiModel: text("ai_model"),
  features: text("features").array().notNull().default([]),
  pros: text("pros").array().notNull().default([]),
  cons: text("cons").array().notNull().default([]),
  platforms: text("platforms").array().notNull().default([]),
  integrations: text("integrations").array().notNull().default([]),
  screenshots: text("screenshots").array().notNull().default([]),
  tags: text("tags").array().notNull().default([]),
  socialLinks: jsonb("social_links").$type<Record<string, string>>(),
  submittedBy: text("submitted_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertToolSchema = createInsertSchema(toolsTable).omit({
  id: true, views: true, clicks: true, bookmarkCount: true, ratingAvg: true,
  reviewCount: true, trendingScore: true, createdAt: true, updatedAt: true,
});
export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof toolsTable.$inferSelect;
