import { Router } from "express";
import { postcomment, showcomment } from "../controllers/comments.controller.js";
import {verfiyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/comments/:channelId').post(verfiyJWT,postcomment)


router.route('/showcomment/:channelId').get(showcomment)


export default router;