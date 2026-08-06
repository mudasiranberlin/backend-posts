import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.models.js";

// Create a post 

const createPost = asyncHandler(async (req, res) => {
        const {name,description,age}=req.body;

       if (!name || !description || !age) {
        throw new ApiError(
            400,
            "All fields are required"
        )
        
       }

       const post = await Post.create({
        name,
        description,
        age,
       });

       

       return res.status(201)
       .json(new ApiResponse(201, post,"Account details Updated sucessfully"))

      
        
    

});

// Read ALl posts

const getPosts = asyncHandler( async(req,res)=>{

    try {
        const post = await await Post.find();
        return res.status(201)
       .json(new ApiResponse(201, post,"Account details Updated sucessfully"))

    } catch (error) {
        console.log(error);  
        
    }
    

} )

//  const updatePost = asyncHandler(async(req,res)=>{

//     // this is the another way to check basic validation if the body is empty 
//     //{name:x, description :y ,age:z} ->[name,description,age]
//     // {} =truthy

//     if (Object.keys(req.body).length === 0) {
//         throw new ApiError(401,"Please eneter the details")   
//     }
//     const {name,description,age,}=req.body

//     const post = await Post.findByIdAndUpdate(req.params._id)



  

//  })

const  updatePost= asyncHandler( async(req,res)=>{
        const {name, description,age} =req.body
        const { id } = req.params;

        console.log("my id",id);
        
        
        
    
        if (!id) {
            throw new ApiError(400,"not get the id")
            
        }
    
        if (! name|| !description || !age) {
    
            throw new ApiError(400,"All fields are required")
            
        }
        const post = await Post.findByIdAndUpdate(
            id,
        {
            $set:{
                name,
                description,
                age
            }
    
        },
        {new:true}
    )
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    
    return res.status(200)
    .json(new ApiResponse(200, post,"Account details Updated sucessfully"))
    
    }
 )



 // delete post 

 const  deletePost= asyncHandler( async(req,res)=>{
        const { id } = req.params;

// findByIdAndDelete(id)	Delete using MongoDB _id
// findOneAndDelete({condition})	Delete using any field



    
        if (!id) {
            throw new ApiError(400,"not get the id")
            
        }
        const post = await Post.findByIdAndDelete(
            id)
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    
    return res.status(200)
    .json(new ApiResponse(200, post,"deleted sucessfully"))
    
    }
 )



export {
    createPost,
    getPosts,
    updatePost,
    deletePost
}