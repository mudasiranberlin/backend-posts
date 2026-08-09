import { Router } from "express"
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import { Subscription } from "../models/subscription.models.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";

const router =Router();

router.route("/subscribers/:channelId").post(verfiyJWT, toggleSubscription);

export default router;
