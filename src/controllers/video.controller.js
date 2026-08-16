import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.models.js";
import { upload } from "../middlewares/multer.middleware.js"
import mongoose, { isValidObjectId } from "mongoose";
import { deleteCloudinary, uploadCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.models.js";

import { Subscription } from "../models/subscription.models.js";


const createVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body;
    const userId = req.user._id;
    console.log(`Here is title ${title} and here is description ${description}`);

    console.log(`Here is title ${title} and here is description ${description}`);

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(
            400,
            "All fields are required"
        )
    }

    // video upload and thumbnail

    const videoFileUpload = req.files?.videoFile?.[0]?.path;

    const thumbnailUpload = req.files?.thumbnail?.[0]?.path;

    if (!videoFileUpload) {
        throw new ApiError(400, "Video file is required")
    }
    if (!thumbnailUpload) {
        throw new ApiError(400, "Thumnail file is required")
    }

    const videoFile = await uploadCloudinary(videoFileUpload)
    const thumbnail = await uploadCloudinary(thumbnailUpload)

    if (!videoFile) {
        throw new ApiError(400, "videofile  is required")
    }
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail file is required")
    }
    const duration = videoFile.duration;


    const video = await Video.create({
        title: title.trim(),
        owner: userId,
        views: 0,
        description: description.trim(),
        isPublished: true,
        duration,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url
    });

    const populatevideo = await Video.findById(video._id).populate("owner", "username avatar fullname");
    return res.status(201)
        .json(new ApiResponse(201, populatevideo, "Video Uploaded  sucessfully"))
});


const showvideo = asyncHandler(async (req, res) => {

    try {
        const video = await await Video.find();
        return res.status(201)
            .json(new ApiResponse(201, video, "All posts are getting sucessfully"))

    } catch (error) {
        console.log(error);

    }


})
const deleteVideo = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "ID is required");
    }

    // console.log("User:",req.user?._id.toString());

    // Get video details
    const video = await Video.findById(id);

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this video");
    }


    // Extract Cloudinary public_id from URL
    const videoPublic = video.videoFile
        .split("/")
        .pop()
        .split(".")[0];

    const ThumbPublic = video.thumbnail
        .split("/")
        .pop()
        .split(".")[0];


    console.log("Cloudinary public id:", videoPublic);
    console.log("Cloudinary public id of thumbnail:", ThumbPublic);

    // Delete from Cloudinary
    await deleteCloudinary(videoPublic);
    await deleteCloudinary(ThumbPublic);

    // // Delete from MongoDB
    await Video.findByIdAndDelete(id);


    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Video deleted successfully"
            )
        );
});

const searchVideo = asyncHandler(async (req, res) => {

    const search = req.body.search
    console.log(search);
    if (!search) {
        throw new ApiError(401, "Please search something ")

    }

    const titles = await Video.find({
        $or: [
            { username: { $regex: search, $options: "i" } },
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ]
    })

    return res.status(201)
        .json(new ApiResponse(201, titles, "All search result"))

})

const getUserVideoProfile = asyncHandler(async (req, res) => {

    const { videoid } = req.params

    console.log("video", videoid);

    if (!isValidObjectId(videoid)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const video = await Video.findById(videoid).populate("owner", "username fullName avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    video.views += 1;
    await video.save({
        validateBeforeSave: false
    });

    const videoObj = video.toObject();
    console.log("result", videoObj);

    videoObj.likesCount = await Like.countDocuments({
        video: video._id
    });

    if (req.user?._id) {

        const like = await Like.findOne({
            video: video._id,
            likeBy: req.user._id
        });

        if (like) {
            videoObj.isLiked = true;
        } else {
            videoObj.isLiked = false;
        }

    } else {

        videoObj.isLiked = false;

    }
    videoObj.owner.subscribersCount =
        await Subscription.countDocuments({
            channel: videoObj.owner._id
        });

    if (req.user?._id) {

        const subscription = await Subscription.findOne({
            channel: videoObj.owner._id,
            subscriber: req.user._id
        });

        videoObj.owner.isSubscribed = subscription ? true : false;

    } else {

        videoObj.owner.isSubscribed = false;

    }

    res.status(200)
        .json(
            new ApiResponse(200, videoObj, "Published status sucessfully")
        )
})


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoid } = req.params

    // if (!isValidObjectId(videoid)) {
    //     throw new ApiError(401,"Please enter the valid video id ")
    // }
    console.log("Reached", videoid);
    const video = await Video.findById(videoid)

    console.log("here:", video);

    console.log("Here is :", video.owner.toString());
    console.log("Here is : ", req.user?._id.toString());

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "UnAuthorized Access")
    }

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    res.status(200)
        .json(
            new ApiResponse(200, video, "Published status sucessfully")
        )
})


export {
    createVideo, //created working perfect
    togglePublishStatus,  //working perfect
    deleteVideo, // working perfectly 
    showvideo,
    searchVideo,
    getUserVideoProfile  //working perfectly
}