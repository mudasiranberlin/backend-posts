import { Router } from "express"
import { createPost } from "../controllers/post.controller.js";
import { getPosts } from "../controllers/post.controller.js";
import {updatePost} from "../controllers/post.controller.js"

const router =Router();

router.route('/create').post(createPost);
router.route('/getPosts').get(getPosts);

router.route('/updatePost/:id').patch(updatePost);
console.log("reached");



export default router;