import { Router } from "express";
import { postcomment } from "../controllers/comments.controller.js";
import {verfiyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/comments/:channelId').post(verfiyJWT,postcomment)

export default router;