## Backend for the project of the viodeo player

# 1 Readme Generator

 You want to create the readme file you can simply go to google and serach .gitignore generator

here is one website i serach there node 

https://mrkandreev.name/snippets/gitignore-generator/#Node

# 2 Create .env file 

# 3 i will using : "type": "module"

## 4 i will be using nodemon

when you save the file it will restart your server automatically 
nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

npm i nodemon

##  Core Differences
The fundamental difference is that dependencies are strictly required for your application to run in production, while devDependencies are only used locally for building, testing, and developing the code

npm i -D nodemon

how to use go to package json 

then scripts and then use this index is your file 
"scripts": {
    "dev": "nodemon src/index.js"
  },

## 6  now create the new folder 
mkdir public
cd public
mkdir temp
touch .gitkeep

now go mail folder 

create new folder mkdir src 
 and then go inside it 
 src % mkdir controllers db middlewares models routes utils 
touch app.js constants.js index.js  

middleware: jatay phelay muj sai mil kai jana 
routes :  
utils:

## 7  Prettier 

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

npm i -D prettier

touch .prettierrc create file
and write in the file :

{
  "singleQuote": false,
  "bracketSpacing": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "semi": true
}

create another file:  touch .prettierignore

to ignore the .env so cannot make any changes there 

write there: or you can generate online prettier ignore 

/.vscode
/node_modules
./dist
*.env
.env
.env.*


# database connection 
here we will use mongodb database

signup and create project and then create cluster and allow all  network access 0.0.0.0 only for learning purpose 

and then copy usernamer and password and save 

and then 

go to database and then cluster and then click on connect and select the connection u can select anyone but i will select the compass and 
like this will be and change the pasasord

mongodb+srv://your cluster:<db_password>@di.jgdl6hb.mongodb.net/

mongodb+srv://anberlin:your_password@mudi.jgdl6hb.mongodb.net


# create the db name in constant :export const DB_NAME = "videotube"

# install package : 

npm install express dotenv mongoose

# database 2 thing note 
1 when connecting the database there will be a problem  use try catch or you can use promises 

2. dataase in another contient (chage the location database ) and then use async await use 

# to connect database we will use if inside it we will use arrow function with async 
;( async (params) => {})() some are using like this do not get confuse.
( async (params) => {})()
now the db is connected refer to index.js in db

## Now use dotenv
i will be using import statement
import dotenv from "dotenv"
dotenv.config({
    path: './env'
})

and then go to package json 
write there :
"scripts": {
    "dev": "nodemon -r dotenv/config src/index.js"
  },
now go to main index.js and call connectDB()

after that 
// Read environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

// If database connects successfully
.then(() => {

    // Watch for server errors
    app.on("error", (error) => {
        console.log(error);
    });

    // Start the server
    app.listen(PORT);
})

// If database connection fails
.catch((err) => {
    console.log(err);
});

Most we will using the request in express 
# Most 2 thing will study 
req.prams: when u get data from url u will get from req.prams handle :  % ?= these prams we are handling
req.body: get data from forms or from json will handle from req.body


req.cookies : you will handle data from cookies 

for this we will need cookie parser

# now lets install cookie-parser and another cors 

cookie-parser → "Read browser cookies."

cors → "Allow or restrict which websites can call my API."

most of the time when when u have to use middleware so mostly u will use=  app.use

Now Lets go to app.js
import cookie-parser, cors

app.use(...) is a rule that applies to every student (every request) entering the school.

1. app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true // You may bring your ID card (cookies, login information)."
}))
Only allow requests coming from this website." "I only trust requests coming from localhost:3000."

2. app.use(express.json({limit:"16kb"}))

3. app.use(express.urlencoded({extended:true,limit:"16kb"}))

4. app.use(express.static("public"))  

5. app.use(cookieParser()) // cookieParser() reads those cookies.




after the let create utility function what it does make our work more easier
 go to untils and create file asyncHandler.js
const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((error)=> next(error))
    }
}
export default asyncHandler


now many times we will return the error and we have not structure of the error and now i want to standardize the api error and api response also want to standrize so it will make it easy 

now for that we will be using class error 


What is ApiError?

ApiError is a custom error class in Node.js.

Normally, JavaScript gives us errors like:

throw new Error("Something went wrong");

But for APIs, we need more information:

What is the HTTP status code? (400, 404, 500)
Was the request successful?
What errors happened?
Where did the error happen?

So we create our own error object.

create the file in utlis Apierror.js
class ApiError extends Error {  
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
create the file in utlis Apiresponse.js

class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}


now after that we will write the models annd 

in the video model we will be using the mongodb aggreation pipeline 

npm i mongoose-paginate-v2
atlast add after timestamps
VideoSchema.plugin(mongooseAggregatePaginate)


now lets go to make password encript and token 
npm i bcrypt
npm i jsonwebtoken
npm i bcrypt jsonwebtoken


now use in usermodel :


Userschema.pre('save', async function (next) {
    if(this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
} )

Userschema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

now we will be using jwt 


Userschema.pre('save', async function (next) {
    if(this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
} )

Userschema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

Userschema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id : this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname // this one is comming from database this.fullname
    },
    process.env.ASSESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ASSESS_TOKEN_EXPIRY,
        
    })
    
} 
Userschema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id : this._id // this one is comming from database this.fullname
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        
    })
    
} 

now we will be using the multer 

Multer is a middleware for Express.js that helps your Node.js application receive files uploaded by users.

Without Multer:

Express can read text (name, email, password)
❌ Express cannot understand uploaded files like images or PDFs.

With Multer:

✅ Express can receive images
✅ PDFs
✅ Videos
✅ Documents
✅ Any uploaded file

Think of Multer as a file receiver.

npm install multer


Why do we need Multer?

Suppose a user registers.

They send:

Username: Ali

Email: ali@gmail.com

Profile Picture: photo.png

Express can read

Username
Email

But : photo.png

is a file.

Express doesn't know how to read it.

Multer does.

now we will use npm install cloudinary and 



What is Cloudinary? (Super Easy Explanation)

Imagine you build a website like Instagram.

Users upload:

📷 Photos
🎥 Videos
📄 PDFs

Where will you keep these files?

You have two choices:

Option 1: Save them on your own server

Problems:

Server storage fills up.
If the server crashes, files may be lost.
Hard to serve millions of images.
Option 2: Use Cloudinary ☁️ (Recommended)

Instead of saving files on your server, upload them to Cloudinary.

User
   │
Uploads Image
   │
Node.js + Multer
   │
Cloudinary
   │
Stores Image
   │
Returns Image URL

Cloudinary safely stores your files in the cloud.

import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
    cloud_name: "your_cloud_name",
    api_key: "your_api_key",
    api_secret: "your_api_secret"
});

import fs from "fs"


and now when we have to use the cloudnary so we have to keep in mind it is like the database 
so use try catch and also async and await 

// Import Cloudinary library to upload files to Cloudinary
import { v2 as cloudinary } from 'cloudinary'

// Import File System module to work with files
import fs from "fs"


// Connect our application with Cloudinary account
cloudinary.config({
    // Your Cloudinary account name
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    // Your Cloudinary API key
    api_key: process.env.CLOUDINARY_API_KEY,

    // Your Cloudinary secret password
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Function to upload a file to Cloudinary
// It receives the location/path of the file stored on our server
const uploadCloudinary = async (localFilePath) => {

    try {

        // If no file path is provided, stop the function
        if (!localFilePath) return null


        // Upload the file from our server to Cloudinary
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                // Automatically detect file type
                // Example: image, video, pdf, etc.
                resource_type: "auto"
            }
        )


        // Upload completed successfully
        // response.url contains the online Cloudinary file URL
        console.log(
            "File uploaded successfully on Cloudinary:",
            response.url
        );


        // Return Cloudinary response information
        return response;


    } catch (error) {


        // If upload fails, delete the temporary file
        // because we don't need it anymore
        fs.unlinkSync(localFilePath)


        // Tell the application that upload failed
        return null

    }
}


// Export this function so we can use it in other files
export { uploadCloudinary }



now create new file in middleware
multer.middleware.js

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage })



now after that we will write controller 

create a file in user.controller.js in controller and write this 
import { asyncHandler } from "../utils/asyncHandler"

const registerUser = asyncHandler( async (req,res)=>{
    res.status(200).json({
        message:"ok"
    })
} )

now after that go the app.js 
import userRouter from './routes/user.routes.js'

app.use("/user",userRouter)

and after that go routes folder and create a file user.routes.js

import { Router } from "express";
import registerUser from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)


now u can install postman to check the details 

http://localhost:8000/api/v1/users/register



now to upload the file we will write a small code for that :

you will go to user routes

import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

export default router



# before go there here i get the error :
now we dont have to mention the next()



// Run this before saving the user
Userschema.pre("save", async function () {

    // If password was NOT changed, skip hashing
    if (!this.isModified("password")) return // next(); next is showing error and also mention no need to send the next in new version of express

    // Convert password into a secure hash
    this.password = await bcrypt.hash(this.password, 10);

    // Continue saving
    // next();
    
});


now after that now we will create the register form :


// Import asyncHandler to handle errors automatically in async functions
import { asyncHandler } from "../utils/asyncHandler.js"

// Import custom error class to create our own errors
import { ApiError } from "../utils/ApiError.js"

// Import User model to interact with MongoDB User collection
import { User } from "../models/user.models.js"

// Import Cloudinary function to upload images
import { uploadCloudinary } from "../utils/cloudinary.js"

// Import custom API response format
import { ApiResponse } from "../utils/ApiResponse.js"


// Register User function
// asyncHandler will catch any error automatically
const registerUser = asyncHandler(async (req, res) => {

    // Getting user information from frontend request body
    // Example:
    // req.body = {
    // fullname:"Mudasir",
    // username:"mudasir123",
    // email:"test@gmail.com",
    // password:"12345"
    // }

    const { fullname, username, email, password } = req.body

console.log("req.files:", req.files);
console.log("req.body:", req.body);



    // Checking if any required field is empty
    // .some() checks if at least one value is empty
    // .trim() removes extra spaces

    if ([fullname, email, username, password].some(
            (field) => field?.trim() === "")) {

        // Stop execution and send error message
        throw new ApiError(
            400,
            "All fields are required"
        )
    }



    // Checking if user already exists in database
    // Search by email OR username

    const existedUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    })



    // If user already exists
    // Do not create duplicate account

    if (existedUser) {

        throw new ApiError(
            409,
            "User with email or username already existed"
        )
    }



    // Getting avatar image path from uploaded files

    // Example:
    // req.files.avatar[0].path
    // = "/uploads/profile.png"

    const avatarlocalpath =
        req.files?.avatar[0]?.path;



    // Getting cover image path


    const coverimagelocalpath =
        req.files?.coverImage[0]?.path




    // Avatar image is required
    // If user did not upload profile picture

    if (!avatarlocalpath) {

        throw new ApiError(
            400,
            "Avatar file is required where is the Error"
        )
    }


console.log("req.files:", req.files);

    // Upload avatar image to Cloudinary
    // Local computer image
    //       |
    //       ↓
    // Cloudinary storage
    //       |
    //       ↓
    // Returns image URL

    const avatar =
        await uploadCloudinary(avatarlocalpath)



    // Upload cover image to Cloudinary

    const coverImage =
        await uploadCloudinary(coverimagelocalpath)




    // If avatar upload failed

    if (!avatar) {

        throw new ApiError(
            400,
            "Avatar file is required"
        )
    }




    // Create new user in MongoDB database

    const user = await User.create({

        // User full name
        fullname,


        // Save Cloudinary avatar URL
        avatar: avatar.url,


        // Save cover image URL
        // If no cover image exists, save empty string

        coverImage: coverImage?.url || "",


        // User email
        email,


        // User password
        password,


        // Convert username into lowercase
        // Example:
        // MUDASIR123 → mudasir123

        username: username.toLowerCase()

    })




    // Find the created user from database
    // Remove password and refresh token
    // because we should never send them to frontend

    const createdUser =
        await User.findById(user._id)
        .select("-password -refreshToken")




    // If user was not created successfully

    if (!createdUser) {

        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        )

    }




    // Send success response back to frontend

    return res.status(201).json(

        new ApiResponse(

            200,

            createdUser,

            "User registered successfully"

        )

    )

})



// Export this function
// So we can use it in routes
// 

export  {registerUser}



and then send data sing the postman


now after that 


# here we got error undefinded then we use this code instead of previous one 

 // Getting cover image path

    // const coverimagelocalpath =
    //     req.files?.coverImage[0]?.path

        let coverimagelocalpath;

        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage >0) {
            coverimagelocalpath = req.files.coverImage[0].path
            
        }



# again usercontroller


#  logout middleware

const logoutUser = await asyncHandler( async (req,res)=>{

// Let's understand this step by step. This logout function has 3 main jobs:
//  Remove the refresh token from the database.
//  Remove the cookies from the browser.
//  Send a success message.

// Step 1
// What is req.user._id?
// Remember this line from verifyJWT:
// req.user = user;
// Suppose the logged-in user is:

// //req.user = {
//     _id: "12345",
//     username: "mudasir",
//     email: "mudasir@gmail.com"
// }


//Then

// req.user._id
// becomes

// 12345
// MongoDB searches for this user.
// It finds user 12345.

// Step 2
// {
//     $set:{
//         refreshToken: undefined
//     }
// }
// Before logout

// Database

// {
//     _id:"12345",
//     username:"mudasir",
//     refreshToken:"abcd123456"
// }
// After logout
// {
//     _id:"12345",
//     username:"mudasir",
//     refreshToken: undefined
// }

he refresh token is removed.

// Why?

// If someone steals the old refresh token, it won't work anymore because the database no longer has it.
Step 3
// {
//     new: true
// }

// This means:

// Return the updated document.

// Example

// Before update

// {
//     username:"mudasir",
//     refreshToken:"abc"
// }

// After update

// {
//     username:"mudasir",
//     refreshToken:undefined
// }

// Since you're not storing the returned document in a variable, this option isn't actually used here. It's harmless but unnecessary.

// https://example.com ✅

// Step 5
// .clearCookie("accessToken", options)

// Suppose the browser has:

// Cookies

// accessToken = xyz123
// refreshToken = abc456

// After

// .clearCookie("accessToken", options)

// it becomes

// Cookies

// refreshToken = abc456

// The access token cookie is deleted.

// Step 6
// .clearCookie("refreshToken", options)

// This removes the refresh token cookie too.

// Now the browser has:

// No cookies
// Step 7
// .json(
//     200,
//     {},
//     "User logged out"
// )

// The client receives:

// {
//     "statusCode": 200,
//     "message": "User logged out"
// }

// (Usually, projects wrap this in an ApiResponse class.)


// Logout = 3 steps

// 1️⃣ Delete refresh token from the database
//         ↓
// 2️⃣ Delete accessToken cookie
//         ↓
// 3️⃣ Delete refreshToken cookie
//         ↓
// ✅ User is logged out

   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )
    const options= {
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200, {}, "User logged out")
    )
})

# middle ware starts from here

router.route("/logout).post(verifyJWT,Logoutuser)

// pratice 

 import { asyncHandler } from "../utils/asyncHandler.js"

# name can be anything here i give the name is verifyjwt 
here we have next also we use middle ware next andwhen it will done and then pass to another 

 export const verfiyJWT = asyncHandler( async(req,res,next
 )=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?replace("Bearer ", "")
    // req.cookies we check there is cookies there or not sometime have mobile so not have cookies   so we are using ? to check accesstoken is present or not 
    // if not have access token so customer can send header to get req.header
    
    //a mobile app usually doesn't send cookies.
    // Instead, it sends the token in the request header.
    // Example request
    // Authorization: Bearer abc123
    // So we read it using
    // req.header("Authorization")
    // It returns
    // Bearer abc123
    
    
    // Why .replace("Bearer ", "")?
    
    // JWT only needs the token.
    // But the header contains
    // Bearer abc123
    // We remove "Bearer ".
    // "Bearer abc123".replace("Bearer ", "")
    // Result
    // abc123
    // Now we have only the JWT token.
    // // 
    
    
    if (!token) {
        throw new ApiError(401,"Unauthorized request")
    }
    
    // now lets access very jwt token 
    
    // now we get the accesstoken from user and now we have verfify it 
    // with the we have create .env where we store ACCESS_TOKEN_SECRET
    // 
    // store in decoded token
    const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
//     What it does:jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

// Checks if the token is real.
// Checks if it was signed with the correct secret key.
// Checks if it has expired.
// If everything is correct, it returns the data inside the token.

    await User.findById(decodedToken?._id).select("-password -refreshtoken")
    // 
    // Find the user in the database
    // Now MongoDB searches for that user.

    //It returns

// user = {
//    _id: "64ab12345",
//    username: "mudasir",
//    email: "mudasir@gmail.com",
//    password: "hashedpassword",
//    refreshToken: "xyz"
// }
    
// Why .select("-password -refreshToken")?
//The minus (-) means do not include these fields.
//Without .select(): .select("-password -refreshToken")

// you get

// {
//    _id: "...",
//    username: "mudasir",
//    email: "..."
// }
// Why?

// We don't need to send the password or refresh token while verifying the user.

// It is safer not to expose them.

// Step 5: Save the user


    if (!user) {
        throw new ApiError(401,"Invalid access token")
        
    }
    req.user= user
    next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Inavlid access token")
        
    }

    // First, what is req?

// req means Request.
// Whenever a client (browser or mobile app) sends a request, Express creates a req object.
// The req object contains information like:

// req.body
// req.params
// req.query
// req.cookies
// req.headers
// You can also add your own custom data to it.
 } )

# Now lets write the model
# subscription model

import mongoose, {Schema} from "mongoose";

const SubscriptionSchema = new Schema(
  {
    subscriber: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

  },
  { timestamps: true }
);

export const Subscription = mongoose.Schema("Subscription",SubscriptionSchema);



update the avatar image :

const updateUserAvatar = asyncHandler(async(req,res)=>{

//     Meaning
// We are creating a function named updateUserAvatar.
// Whenever a user uploads a new profile picture, this function runs.
// req = information sent by the user
// res = response sent back to the user

    const avatarLocalPath = res.files?.path
// What is happening?
// When the user uploads an image using Multer, 
// Multer temporarily stores it on your computer.
    
    if (!avatarLocalPath) {
        throw new ApiResponse(401,"File missing")  

// If the user did not upload any image
// avatarLocalPath = undefined
// if upload then avatarLocalPath= uploads/avatar123.jpg

    }
    const avatar = await uploadOnCloudinary(avatarlocalpath)
// Meaning
// Take the image stored on your computer
// uploads/myphoto.jpg
// and upload it to Cloudinary.
// Cloudinary returns something like

// {
//    url: "https://res.cloudinary.com/abc123/avatar.jpg",
//    public_id: "avatar123"
// }
// avatar.url
// contains
// https://res.cloudinary.com/abc123/avatar.jpg


    if (!avatar.url) { // Suppose Cloudinary fails.
        throw new ApiResponse(401,"File missing") 
    }

    // Find the logged-in user. like req.user._id -> 64a8bd78291...
    // MongoDB finds

//     Meaning

// Replace the old avatar with the new one.

// Before

// Before
// {
//    username:"Ali",
//    avatar:"old.jpg"
// }
// After

// {
//    username:"Ali",
//    avatar:"https://cloudinary.com/new.jpg"
// }

// Meaning

// Return the updated document, not the old one.

// Without it

// Old User

// With it

// Updated User
    const user = await findByIdAndUpdate(req.user?._id,
    {
        $set:{
            avatar:avatar.url
        }
    },
    {new:true}
    ).select("-password")

return res.status(200).json(
    new ApiResponse(200, user, "Avatar updated successfully")
)


//     Don't return the password.

// Example

// Without .select()

})




// Complete Flow (Easy Diagram)
// User uploads image
//         │
//         ▼
// req.file.path
//         │
//         ▼
// uploads/avatar.jpg
//         │
//         ▼
// uploadOnCloudinary()
//         │
//         ▼
// Cloudinary URL
//         │
//         ▼
// https://cloudinary.com/avatar.jpg
//         │
//         ▼
// Find logged-in user
//         │
//         ▼
// Update avatar field
//         │
//         ▼
// Save in MongoDB
//         │
//         ▼
// Return updated user

same like that have to update cover image




//End of the practice


 














## Author Mudasir @ Anberlin