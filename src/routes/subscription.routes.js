import { Router } from "express"
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import { Subscription } from "../models/subscription.models.js";
import { toggleSubscription , getUserChannelSubscribers , getSubscribedChannels } from "../controllers/subscription.controller.js";

const router =Router();

router.route("/subscribers/:channelId").post(verfiyJWT, toggleSubscription);
router.route("/getUserChannel/:channelId").post(verfiyJWT, getUserChannelSubscribers);
router.route("/getSubscribed/:channelId").post(verfiyJWT, getSubscribedChannels);



export default router;
