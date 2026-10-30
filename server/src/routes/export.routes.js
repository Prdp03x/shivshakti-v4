import { Router } from "express"; import { asyncRoute } from "../middleware/security.js"; import * as c from "../controllers/export.controller.js";
const router=Router();router.get("/excel",asyncRoute(c.excel));export default router;
