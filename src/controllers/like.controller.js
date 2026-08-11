import mongoose, {isValidObjectId} from "mongoose"
import { Like } from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


//TODO: toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {

    const {videoId} = req.params
    const userId = req.user?._id

    console.log("Video",videoId);
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"Cant find the video id");
        
    }
     if (!userId) {
        throw new ApiError(401,"Cant find the video id");
    }

    const existedlike = await Like.findOne({
        video:videoId,
        likedBy:userId
    })

    if (existedlike) {
        await Like.findByIdAndDelete(existedlike._id)
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { liked: false },    // And when the user unlikes:the frontend can do: liked: false
                    "unlike sucessfully "
                )
            );
    }
        

    const like = await Like.create({
                 video: videoId,
                likedBy: userId
    })
    if (!like) {
        throw new ApiError(500,"Cannot like the video");
        
    }
    return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { liked: true, like },
                    "liked sucessfully "
                )
            );


           

           /*
          // { liked: true, like }
           {
    "statusCode": 201,
    "data": {
    "liked": true,
        "like": {
            "_id": "abc123",
            "video": "video456",
            "likedBy": "user789"
        }
    },
    "message": "Liked successfully"
}
           */
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    console.log("Here is comment id",commentId);

    const userId = req.user?._id
    
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400,"Cant find the video commentId");
        
    }
     if (!userId) {
        throw new ApiError(401,"Cant find the video id");
    }

    const existedlike = await Like.findOne({
        comment:commentId,
        likedBy:userId
    })

    if (existedlike) {
        await Like.findByIdAndDelete(existedlike._id)
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { liked: false },    // And when the user unlikes:the frontend can do: liked: false
                    "unlike sucessfully "
                )
            );
    }
        

    const like = await Like.create({
                 comment: commentId,
                likedBy: userId
    })
    if (!like) {
        throw new ApiError(500,"Cannot like the video");
        
    }
    return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { liked: true, like },
                    "liked sucessfully "
                )
            );
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    console.log("Reached");
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    console.log("Reached");
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}