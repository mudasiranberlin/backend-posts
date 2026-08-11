import mongoose, { isValidObjectId } from "mongoose"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { Tweet } from "../models/tweet.models.js"
import { Like } from "../models/like.models.js"



const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body 
    const userId = req.user._id
    //TODO: create tweet
    console.log("Reached");
    console.log("Here is the Tweet",content);
    console.log("Here is the User",userId);
    if (!content) {
        throw new ApiError(201,"Please eneter the Tweet");
    }
    if (!userId) {
        throw new ApiError(201,"Please eneter the Tweet");
    }
    const tweet = await Tweet.create({
        content:content,
        owner:userId
    })

    if (!tweet) {
        throw new ApiError(201,"Not find the User")
    }
    return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        tweet, 
                        "Tweet Sucessfully "
                    )
                );
})
const getUserTweets = asyncHandler(async (req, res) => {
     const userId = req.user._id
    // TODO: get user tweets
    if (!userId) {
        throw new ApiError(201,"Please eneter the Tweet");
    }

    const gettweet = await Tweet.find({
        owner:userId
    })
    return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        gettweet, 
                        "Here is the tweets "
                    )
                );

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { Id } = req.params;
    console.log("Reached",Id);
    const {content} = req.body
      if (!content) {
        throw new ApiError(201,"Please eneter the Tweet");
    }
     if (!isValidObjectId(Id)) {
        throw new ApiError(201,"Please eneter the Id");
    }

    const tweet = await Tweet.findById(Id)
    if (!tweet) {
        throw new ApiError(201,"Tweet not found to update");
    }

    console.log("Owner 1",tweet.owner.toString());
    console.log("Owner 2",req.user?._id.toString());


    if (tweet.owner.toString() !==req.user?._id.toString() ) {

         throw new ApiError(201,"UnAuthorized Access");
    }
    
    
    const updateTweet = await Tweet.findByIdAndUpdate(
        Id,{
             $set:{
            content:content
        }
        }
    )
    return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        updateTweet, 
                        "Updated tweet sucessfully "
                    )
                );
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    
     let  {Id}  = req.params;
     console.log("The id is here 1",Id);
      if (!Id) {
        throw new ApiError(201,"Please eneter the Tweet");
    }
    console.log("id is here 2",Id);
    const tweet = await Tweet.findById(Id)

    console.log("Tweet",tweet);
    
    if (!tweet) {
        throw new ApiError(201,"tweet not found");
    }

    // console.log("owner:",tweet.owner);
    // console.log("user:",req.user?._id);
    
    if (tweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this tweet");
  }
    await Tweet.findByIdAndDelete(Id);
    return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {}, 
                        "Tweet deleted successfully "
                    )
                );


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}