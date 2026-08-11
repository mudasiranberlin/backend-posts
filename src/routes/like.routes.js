import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";


import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();





router.route('/toggleVideoLike/:videoId').post(verfiyJWT,toggleVideoLike)
router.route('/showcomment/:commentId').post(verfiyJWT,toggleCommentLike)
router.route('/tweetlike/:tweetId').post(verfiyJWT,toggleTweetLike)
router.route('/getLikedVideos').get(verfiyJWT,getLikedVideos) 


export default router;