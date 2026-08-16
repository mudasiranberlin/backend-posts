import mongoose, {isValidObjectId} from "mongoose"
import { Like } from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


//TODO: toggle like on video

const tooglelike = async(filter)=>{
    const existedlike = await Like.findOne(filter)
    if (existedlike) {
        await Like.findOneAndDelete(filter)
        return {liked :false}
    }
    else{
        await Like.create(filter)
        return {liked:true}
    }
}
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
    const result = await tooglelike({video:videoId,likedBy:userId})
    
    return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    result,
                    "liked sucessfully "
                )
            );
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user?._id
    
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400,"Cant find the video commentId");
    }
     if (!userId) {
        throw new ApiError(401,"Cant find the video id");
    }
    
    const result = await tooglelike({comment:commentId,likedBy:userId})
     return res
             .status(201)
             .json(
                 new ApiResponse(
                     201,
                     result,
                     "liked sucessfully "
                 )
             );
})

// tweet like //TODO: toggle like on tweet pass tweet id 




const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    if (!userId) {
        throw new ApiError(401, "User is not authenticated")
    }

    const result = await tooglelike({
        tweet: tweetId,
        likedBy: userId
    })
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                result.liked
                    ? "Tweet liked successfully"
                    : "Tweet unliked successfully"
            )
        )
})


const getLikedVideos = asyncHandler(async (req, res) => {

    //TODO: get all liked videos

    console.log("Reached");
     const userId = req.user?._id
     console.log(userId);
     
     if (!userId) {
        throw new ApiError(201,"Please eneter the user details");
     }
     
     
     const likevideo = await Like.find({
        likedBy:userId,
        video: { $ne: null }
     }).populate("likedBy","username avatar ")

     if (!likevideo) {
        throw new ApiError(201,"You have not like any video")
     }
     return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                   likevideo,
                    "Liked Videos fetched sucessfully "
                )
            );
})

export {
    toggleCommentLike, //working
    toggleTweetLike,  // working
    toggleVideoLike, // working
    getLikedVideos // working
}





/*
ANother way of code :


const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    console.log("Here is tweetId id",tweetId);

    const userId = req.user?._id
    
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400,"Cant find the tweet id");
    }
     if (!userId) {
        throw new ApiError(401,"Cant find the User id");
    }
    console.log("Here is tweetId id",tweetId);
    console.log("Here is User id",userId);

        
    

    const existedlike = await Like.findOne({
        tweet:tweetId,
        likedBy:userId
    })

    console.log("Here is ",existedlike);
    
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
                 tweet: tweetId,
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
}
)



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