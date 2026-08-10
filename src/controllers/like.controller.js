import mongoose, {isValidObjectId} from "mongoose"
import { Like } from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


/*
const channel = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"

            }

        },
        {
            $addFields:{
                subscribersCount:{
                    $size: "$subscribers"
                },
                channelSubscribedToCount:{
                    $size:"$subscribedTo" 
                },

                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }

            }
        },
        {
            $project:{
            fullname:1,
            username:1,
            subscribersCount:1,
            isSubscribed:1,
            avatar:1,
            coverImage:1,
            email:1

        }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(401,"Channel doest not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,channel[0],"User channel fetched sucessfully"
        )
    )
})




*/





//TODO: toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user?._id
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
    //TODO: toggle like on comment

    console.log("Reached");

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