import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose"

const toggleSubscription = asyncHandler(async (req, res) => {

    console.log("Reached");
    console.log("Here is the is :", req.user._id)



    const { channelId } = req.params
    console.log("Here is the channel id", channelId);

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(201, "Please enter valid object id")
    }

    if (channelId.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const existed = await Subscription.findOne({
        subscriber:req.user._id,
        channel: channelId
    })
    if (existed) {
        await Subscription.findByIdAndDelete(existed._id)
        return res.status(200).json( new ApiResponse(200,{subscribed:false},"Unsubscribe Sucessfully"))
    }
    await Subscription.create({
            subscriber: req.user._id,
            channel: channelId,
           });
           return res.status(200).json( new ApiResponse(200,{subscribed:true},"Subscribe Sucessfully"))
  



})
const getUserChannelSubscribers = asyncHandler(async(req,res)=>{

  const channelId = req.params.channelId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(201,"Please enetr valid object id");
  }
  console.log("channel",channelId);
  const subscribers = await Subscription.aggregate([
    {
      $match:{
        channel:new mongoose.Types.ObjectId(channelId)
      }
    },{
      $lookup:{
        from:"users",
        localField:"subscriber",
        foreignField:"_id",
        as: "subscribe"
      }
    },
    {
       $unwind: "$subscribe"
   },
   {
    $project:{
      _id: "$subscribe._id",
      username: "$subscribe.username",
      avatar: "$subscribe.avatar",
      createdAt:1
    }
   }

  ])
  res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Channel subscribers fetched successfully"));
})

const getSubscribedChannels = asyncHandler(async(req,res)=>{

  const channelId = req.params.channelId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(201,"Please enetr valid object id");
  }
  console.log("channel",channelId);
  const subscribers = await Subscription.aggregate([
    {
      $match:{
        channel:new mongoose.Types.ObjectId(channelId)
      }
    },{
      $lookup:{
        from:"users",
        localField:"channel",
        foreignField:"_id",
        as: "channelDetails"
      }
    },  // same like previous only change the channel and as to channel details then channelDetails.id
    {
       $unwind: "$channelDetails"
   },
   {
    $project:{
      _id: "$channelDetails._id",
      username: "$channelDetails.username",
      avatar: "$channelDetails.avatar",
      createdAt:1
    }
   }

  ])
  res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Channel subscribers fetched successfully"));
})


export {
    toggleSubscription,  //perfect
    getUserChannelSubscribers, //working perfect
    getSubscribedChannels ////working perfect
}