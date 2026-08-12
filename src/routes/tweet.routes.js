import { Router } from "express";
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import { deleteTweet , updateTweet ,createTweet ,getUserTweets } from "../controllers/tweet.controller.js";
const router = Router();



// router.route('/showcomment/:commentId').post(getUserTweets)

router.route('/createTweet').post(verfiyJWT,createTweet)
router.route('/getUserTweets/:id').get(verfiyJWT,getUserTweets)
router.route('/updateTweet/:Id').patch(verfiyJWT,updateTweet)
router.route('/deleteTweet/:Id').delete(verfiyJWT,deleteTweet) 


export default router;