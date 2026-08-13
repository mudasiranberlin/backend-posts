import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.models.js";
import {upload} from "../middlewares/multer.middleware.js"

import mongoose from "mongoose";
import { deleteCloudinary, uploadCloudinary } from "../utils/cloudinary.js";

const createVideo = asyncHandler(async (req, res) => {
    
        const {title,description}=req.body;
        const userId = req.user._id;
        console.log(`Here is title ${title} and here is description ${description}`);

        console.log(`Here is title ${title} and here is description ${description}`);
        
        const isPublished =true

       if (!title?.trim() || !description?.trim()) {
        throw new ApiError(
            400,
            "All fields are required"   
        )}
        
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
        title:title.trim(),
        owner:userId,
        views:0,
        description:description.trim(),
        isPublished,
        duration,
        videoFile:videoFile.url,
        thumbnail:thumbnail.url
       });

       const populatevideo = await Video.findById(video._id).populate("owner", "username avatar fullname");
       return res.status(201)
       .json(new ApiResponse(201, populatevideo,"Video Uploaded  sucessfully"))
});


    const showvideo = asyncHandler( async(req,res)=>{
    
        try {
            const video = await await Video.find();
            return res.status(201)
           .json(new ApiResponse(201, video,"All posts are getting sucessfully"))
    
        } catch (error) {
            console.log(error);  
            
        }
        
    
    } )
    const deleteVideo = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "ID is required");
    }


    // Get video details
    const video = await Video.findById(id);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }


    // Extract Cloudinary public_id from URL
    const public_id = video.videoFile
        .split("/")
        .pop()
        .split(".")[0];


    console.log("Cloudinary public id:", public_id);


    // Delete from Cloudinary
    await deleteCloudinary(public_id);


    // Delete from MongoDB
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

   const searchVideo= asyncHandler (async (req,res)=>{
       
       const search = req.body.search
        console.log(search);
       if (!search) {
           throw new ApiError(401,"Please search something ")
           
       }
   
       const titles = await Video.find({
           $or:[
               { username: { $regex: search, $options: "i" } },
               { title: { $regex: search, $options: "i" } },
               { description: { $regex: search, $options: "i" } }
           ]
       })
   
       return res.status(201)
       .json(new ApiResponse(201,titles,"All search result"))
   
   })

   const getUserVideoProfile = asyncHandler(async (req, res) => {

    console.log("Mudasir");
    

    const {id } = req.params;

     console.log(id);
    if (id) {
        throw new ApiError(400, "Username is missing");
    }

    const videos = await Video.aggregate([
  {
    '$lookup': {
      'from': 'users', 
      'localField': 'users_id', 
      'foreignField': 'owner', 
      'as': 'result'
    }
  },
  {
    $addFields:{
        owner:{
            $first:"$result"
        }
    }
  }
])
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos
            },
            "User videos fetched successfully"
        )
    );
});

export {
    createVideo,
    showvideo,
    deleteVideo,
    searchVideo,
    getUserVideoProfile
}