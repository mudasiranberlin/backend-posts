import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { Subscription } from "../models/subscription.models.js"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    console.log("Reached");
    const userid = req.user?._id
    const video = await Video.countDocuments({
        owner: userid
    })

    const views = await Video.aggregate([
        {
            $match: {
                owner: userid
            }

        }, {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ])

    const likes = await Like.countDocuments({
        likedBy: userid
    })

    const subscribe = await Subscription.countDocuments({
        channel: userid
    })

    const userVideos = await Video.find({ owner: userid }).select("_id");
  const videoIds = userVideos.map((v) => v._id);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {
                    userVideos,
                    videoIds
                },
                "Comment has been deleted "
            )
        );




})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    console.log("reached");

})

export {
    getChannelStats,
    getChannelVideos
}