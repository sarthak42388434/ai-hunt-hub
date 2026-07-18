/**
 * Promote a user to admin.
 * Usage:
 *   pnpm --filter @workspace/db exec tsx src/make-admin.ts
 *   pnpm --filter @workspace/db exec tsx src/make-admin.ts you@email.com
 */

import { db, pool } from "./index.js";
import { usersTable } from "./schema/index.js";
import { eq, asc } from "drizzle-orm";

const email = process.argv[2];

const allUsers = await db
  .select()
  .from(usersTable)
  .orderBy(asc(usersTable.createdAt))
  .limit(10);

if (allUsers.length === 0) {
  console.log("\n  No users found yet.");
  console.log("  Sign in to your app at least once first, then run this again.\n");
  await pool.end();
  process.exit(0);
}

console.log("\nSigned-up users:");
allUsers.forEach((u, i) =>
  console.log(`  ${i + 1}. ${u.name ?? "(no name)"} | ${u.email ?? "(no email)"} | role: ${u.role}`)
);

let target = email ? allUsers.find((u) => u.email === email) : allUsers[0];

if (!target) {
  console.log(`\n  Could not find user "${email}" — promoting user #1 instead.`);
  target = allUsers[0];
}

await db.update(usersTable).set({ role: "admin" }).where(eq(usersTable.id, target.id));

console.log(`\n  ✅ Done! "${target.name ?? target.clerkUserId}" is now an admin.`);
console.log("  Refresh the app and visit /admin to see your dashboard.\n");

await pool.end();
