import { Router } from "express"
import { createPost } from "../controllers/post.controller.js";
import { getPosts } from "../controllers/post.controller.js";
import {updatePost,deletePost} from "../controllers/post.controller.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";

const router =Router();

router.route('/create').post(verfiyJWT,createPost);
router.route('/getPosts').get(getPosts);

router.route('/updatePost/:id').patch(updatePost);
router.route('/deletePost/:id').delete(deletePost)
console.log("reached");



export default router;