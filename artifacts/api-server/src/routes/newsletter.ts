import { Router } from "express";
import { db, newsletterSubscribersTable } from "@workspace/db";

const router = Router();

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "Valid email required" });
    return;
  }

  try {
    await db.insert(newsletterSubscribersTable).values({ email }).onConflictDoNothing();
    res.sendStatus(201);
  } catch {
    res.status(400).json({ error: "Could not subscribe" });
  }
});

export default router;
