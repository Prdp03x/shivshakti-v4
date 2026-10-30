import { Router } from "express"; import { asyncRoute } from "../middleware/security.js"; import * as c from "../controllers/backup.controller.js";
const router=Router();router.get("/",asyncRoute(c.backup));router.post("/restore",asyncRoute(c.restore));export default router;
