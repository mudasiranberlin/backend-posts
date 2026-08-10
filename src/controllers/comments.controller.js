import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comments.models.js"
import { Subscription } from "../models/subscription.models.js";



const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})




const showcomment = asyncHandler(async (req, res) => {

    console.log("Reached");
    const { channelId } = req.params
    // const {page = 1, limit = 10} = req.query

    const limit = 5;
    const page = 3;
    const skip = (page-1)*limit;

    if (!channelId) {
        throw new ApiError(200, "Cannot find the id ")
    }
    const comment = await Comment.find({
        video: channelId
    }).skip(skip).limit(limit)

    if (!comment) {
        throw new ApiError(201,"No comments found")
        
    }
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




const postcomment = asyncHandler(async (req, res) => {
    console.log("Reached here");
    const { channelId } = req.params
    const { comment } = req.body;
    const user_id = req.user._id.toString()

    console.log("Comment", comment);
    console.log("channel", channelId);
    console.log("id", user_id);


    if (!comment.trim() || !channelId) {
        throw new ApiError(200, "Please enter the comment")
    }

    const content = await Comment.create({
        content: comment.trim(),
        video: channelId,
        owner: user_id
    })
    if (!content) {
        throw new ApiError(201, "Not post any comment")
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



const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { id } = req.params
    console.log("Reach Here", id);

    if (!id) {
        throw new ApiError(201, "Please Eneter the comment");

    }

    const update = await Comment.findByIdAndUpdate(id,
        {
            $set:
                { content }
        },
        // {new : true} old syntax
        { returnDocument: "after" }
    )
    if (!update) {
        throw new ApiError(201, "Cannot find the commet to Update");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                update,
                "Comment updated are here "
            )
        );


})
const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { id } = req.params

    if (!id) {
        throw new ApiError(201, "Please Eneter the comment");

    }

    const deletecommentinside = await Comment.findByIdAndDelete(id)

    if (!deletecommentinside) {
        throw new ApiError(201, "Cannot find the coommet to delete");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                deletecommentinside,
                "Comment has been deleted "
            )
        );

})



export {
    postcomment,
    showcomment,
    updateComment,
    deleteComment
}