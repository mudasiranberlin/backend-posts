import { Router } from "express";

import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();





router.route('/toggleVideoLike').post(getLikedVideos)
router.route('/showcomment/:channelId').get(toggleCommentLike)
router.route('/updatecomment/:id').patch(toggleTweetLike)
router.route('/deletecomment/:id').delete(toggleVideoLike)


export default router;