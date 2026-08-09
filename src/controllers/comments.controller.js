import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Comment} from "../models/comments.models.js"
import { Subscription } from "../models/subscription.models.js";

const postcomment = asyncHandler(async(req,res)=>{
    console.log("Reached here");
    const {channelId}= req.params
    const { comment } = req.body;
    const user_id = req.user._id.toString()

    console.log("Comment",comment);
    console.log("channel",channelId);
    console.log("id",user_id);
    

    if (!comment.trim() || !channelId) {
        throw new ApiError(200,"Please enter the comment")
    }
    
    const content = await Comment.create({
        content:comment.trim(),
        video:channelId,
        owner:user_id
    })
    if (!content) {
        throw new ApiError(201,"Not post any comment")
    }
     return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                content,
                "Comment posted successfully"
            )
        );
})

        const showcomment = asyncHandler(async(req,res)=>{

            console.log("Reached");
            const {channelId}= req.params
            if (!channelId) {
                throw new ApiError(200,"Cannot find the id ")
            }
            const comment = await Comment.find({
                video:channelId
            })
            return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                comment,
                "Comment are here "
            )
        );
        })
        


export{
    postcomment,
    showcomment
}