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

    console.log(views);

    const totalViews = views[0]?.totalViews || 0;

    console.log("Total views", totalViews);


    const subscribe = await Subscription.countDocuments({
        channel: userid
    })



    const userVideos = await Video.find({ owner: userid }).select("_id");

    // you can use the for of loop to get the ids or map loop
    /*
        const videosids = []
        for (const element of userVideos) {
            videosids.push(element._id)
        }
        console.log("videosids",videosids);
    
        */

    const videoIds = userVideos.map((v) => v._id);

    console.log("videoIds", videoIds);


    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {
                    video,
                    totalViews,
                    subscribe,
                    totalLikes
                },
                "Comment has been deleted "
            )
        );
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id;

    const videos = await Video.find({ owner: userId }).populate("owner", "_id username avatar").sort({ createdAt: -1 }).lean()

    const videosWithLikes = [];
    const currentUserId = req.user?._id;
    for (const video of videos) {
        const likesCount = await Like.countDocuments({
            video: video._id
        });

        const isLiked = currentUserId
            ? !!(await Like.findOne({
                video: video._id,
                likeBy: currentUserId
            }))
            : false;

        videosWithLikes.push({
            ...video,
            likesCount,
            isLiked
        });
    }
    console.log("reached");

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { videosWithLikes },
                "Channel videos fetched successfully"
            )
        );

})

export {
    getChannelStats,
    getChannelVideos
}