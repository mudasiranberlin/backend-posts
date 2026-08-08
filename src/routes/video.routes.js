import { Router } from "express"
import {createVideo, deleteVideo, showvideo,searchVideo, getUserVideoProfile} from "../controllers/video.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verfiyJWT } from "../middlewares/auth.middleware.js";


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
    ]),verfiyJWT,
    createVideo);

router.route('/show').get(showvideo);
router.route('/deletevideo/:id').patch(deleteVideo);

router.route('/serachvideo').get(verfiyJWT,searchVideo)

router.route('/getUser').get(getUserVideoProfile)

export default router;