import { Router } from "express"; import { asyncRoute } from "../middleware/security.js"; import * as c from "../controllers/customer.controller.js";
const router=Router();router.get("/",asyncRoute(c.listCustomers));export default router;
