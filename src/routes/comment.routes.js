import { Router } from "express";
import { deleteComment, postcomment, showcomment, updateComment } from "../controllers/comments.controller.js";
import {verfiyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/comments/:channelId').post(verfiyJWT,postcomment)


router.route('/showcomment/:channelId').get(showcomment)
router.route('/updatecomment/:id').patch(updateComment)
router.route('/deletecomment/:id').delete(deleteComment)


export default router;