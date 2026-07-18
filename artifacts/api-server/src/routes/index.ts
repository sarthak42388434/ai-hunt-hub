import { Router } from "express";
import homeRouter from "./home";
import toolsRouter from "./tools";
import reviewsRouter from "./reviews";
import categoriesRouter from "./categories";
import tagsRouter from "./tags";
import bookmarksRouter from "./bookmarks";
import blogRouter from "./blog";
import newsRouter from "./news";
import newsletterRouter from "./newsletter";
import usersRouter from "./users";
import adminRouter from "./admin";
import healthRouter from "./health";

const router = Router();

router.use(healthRouter);
router.use(homeRouter);
router.use(toolsRouter);
router.use(reviewsRouter);
router.use(categoriesRouter);
router.use(tagsRouter);
router.use(bookmarksRouter);
router.use(blogRouter);
router.use(newsRouter);
router.use(newsletterRouter);
router.use(usersRouter);
router.use(adminRouter);

export default router;
