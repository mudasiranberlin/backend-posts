import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";


import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();





router.route('/toggleVideoLike/:videoId').post(verfiyJWT,toggleVideoLike)
router.route('/showcomment/:channelId').get(toggleCommentLike)
router.route('/updatecomment/:id').patch(toggleTweetLike)
router.route('/deletecomment/:id').delete(toggleVideoLike)


export default router;