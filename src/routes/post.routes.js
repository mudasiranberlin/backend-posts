import { Router } from "express"
import { createPost, limitpost } from "../controllers/post.controller.js";
import { getPosts } from "../controllers/post.controller.js";
import {updatePost,deletePost} from "../controllers/post.controller.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";
import { Video } from "../models/video.models.js";

const router =Router();

router.route('/create').post(createPost);

// router.route('/create').post(verfiyJWT,createPost);
router.route('/getPosts').get(getPosts);

//for limt limitpost

router.route('/limit').get(limitpost);

router.route('/updatePost/:id').patch(updatePost);
router.route('/deletePost/:id').delete(deletePost);

export default router;