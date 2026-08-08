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
       .json(new ApiResponse(201, post,"Post created  sucessfully"))

      
        
    

});

// Read ALl posts

const getPosts = asyncHandler( async(req,res)=>{

    try {
        const post = await await Post.find().sort({name:-1});

        return res.status(201)
       .json(new ApiResponse(201, post,"All posts are getting sucessfully"))

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
    .json(new ApiResponse(200, post,"Post  Updated sucessfully"))
    
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
    .json(new ApiResponse(200, post,"Post has been deleted sucessfully"))
    
    }
 )


 // Now i want to use limits 
 // Read ALl posts

const limitpost = asyncHandler( async(req,res)=>{
    const limit = 5;
    const page = 3;
    const skip = (page-1)*limit

    try {
        const total = await Post.countDocuments();
        const post = await Post.find().sort({name:1}).skip(skip).limit(limit)

        
        console.log(total);
        
        return res.status(201)
       .json(new ApiResponse(201, post,"All posts are getting sucessfully"))

    } catch (error) {
        console.log(error);  
        
    }
    

} )

 // end limits 


// now lets use search by id and also serach by title 

const searchid = asyncHandler( async(req,res)=>{
    const {id} = req.params
    if (!id) {
        throw new ApiError(201,"Cannot find the id")
    }
    const search = await Post.findById(id)
    if (!search) {
        throw new ApiError(201,"Cannot find the id")
    }
     return res.status(201)
       .json(new ApiResponse(201, search,"All posts are getting sucessfully"))
} )


// find already using by id 

// now lets find using the title and description 

const searchUsingTitle= asyncHandler (async (req,res)=>{
    
    const search = req.body.search
     console.log(search);
    if (!search) {
        throw new ApiError(401,"Please search something ")
        
    }

    const titles = await Post.find({
        $or:[
            { username: { $regex: search, $options: "i" } },
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ]
    })

    return res.status(201)
    .json(new ApiResponse(201,titles,"All search result"))

})



export {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    limitpost,
    searchid,
    searchUsingTitle
}