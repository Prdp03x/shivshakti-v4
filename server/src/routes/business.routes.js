import { Router } from "express"; import { asyncRoute } from "../middleware/security.js"; import * as c from "../controllers/business.controller.js";
const router=Router();router.get("/",asyncRoute(c.getBusiness));router.put("/",asyncRoute(c.updateBusiness));export default router;
