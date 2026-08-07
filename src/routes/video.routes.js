import { Router } from "express"
import {createVideo, deleteVideo, showvideo} from "../controllers/video.controller.js"
import {upload} from "../middlewares/multer.middleware.js"


const router =Router();

router.route("/videos").post(
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    createVideo);

router.route('/show').get(showvideo);
router.route('/deletevideo/:id').patch(deleteVideo);

export default router;