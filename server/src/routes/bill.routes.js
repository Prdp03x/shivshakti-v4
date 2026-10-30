import { Router } from "express"; import { asyncRoute } from "../middleware/security.js"; import * as c from "../controllers/bill.controller.js";
const router=Router();router.get("/",asyncRoute(c.list));router.post("/",asyncRoute(c.create));router.get("/:id",asyncRoute(c.getById));router.delete("/:id",asyncRoute(c.remove));export default router;
