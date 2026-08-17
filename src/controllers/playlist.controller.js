import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// =====================================================
// CREATE PLAYLIST
// =====================================================

const createPlaylist = asyncHandler(async (req, res) => {

    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Please enter the playlist name");
    }

    if (!description) {
        throw new ApiError(400, "Please enter the playlist description");
    }

    // Logged-in user's ID
    const owner = req.user?._id;

    if (!owner) {
        throw new ApiError(401, "User not authenticated");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner
    });

    res
        .status(201)
        .json(
            new ApiResponse(
                201,
                playlist,
                "Playlist created successfully"
            )
        );
});


// =====================================================
// GET USER PLAYLISTS
// =====================================================

const getUserPlaylists = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    // Check user ID
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // Find all playlists where owner = userId
    const playlists = await Playlist.find({
        owner: userId
    });

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlists,
                "User playlists fetched successfully"
            )
        );
});


// =====================================================
// GET PLAYLIST BY ID
// =====================================================

const getPlaylistById = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Find playlist by its _id
    // Populate the videos
    const playlist = await Playlist.findById(playlistId)
        .populate("video");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist fetched successfully"
            )
        );
});


// =====================================================
// ADD VIDEO TO PLAYLIST
// =====================================================

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params;

    // Check both IDs
    if (
        !isValidObjectId(playlistId) ||
        !isValidObjectId(videoId)
    ) {
        throw new ApiError(
            400,
            "Invalid playlist or video ID"
        );
    }

    /*
        Find playlist by playlistId

        Then add videoId to the video array

        $addToSet means:
        Add video only if it doesn't already exist
    */

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,

        {
            $addToSet: {
                video: videoId
            }
        },

        {
            new: true
        }
    ).populate("video");

    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found"
        );
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video added to playlist successfully"
            )
        );
});


// =====================================================
// REMOVE VIDEO FROM PLAYLIST
// =====================================================

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params;

    // Check IDs
    if (
        !isValidObjectId(playlistId) ||
        !isValidObjectId(videoId)
    ) {
        throw new ApiError(
            400,
            "Invalid playlist or video ID"
        );
    }

    /*
        IMPORTANT:

        We use findByIdAndUpdate()

        NOT findByIdAndDelete()

        because we DON'T want to delete
        the entire playlist.

        $pull removes the video from
        the playlist's video array.
    */

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,

        {
            $pull: {
                video: videoId
            }
        },

        {
            new: true
        }
    ).populate("video");

    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found"
        );
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video removed from playlist successfully"
            )
        );
});


// =====================================================
// DELETE PLAYLIST
// =====================================================

const deletePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;

    console.log("Reached deletePlaylist");

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(
            400,
            "Invalid playlist ID"
        );
    }

    /*
        This deletes the WHOLE playlist.

        findByIdAndDelete()
        ↓
        Find playlist by _id
        ↓
        Delete playlist
    */

    const playlist = await Playlist.findByIdAndDelete(
        playlistId
    );

    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found"
        );
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist deleted successfully"
            )
        );
});


// =====================================================
// UPDATE PLAYLIST
// =====================================================

const updatePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;

    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(
            400,
            "Invalid playlist ID"
        );
    }

    // At least one field should be provided
    if (!name && !description) {
        throw new ApiError(
            400,
            "Please provide name or description"
        );
    }

    const updateData = {};

    if (name) {
        updateData.name = name;
    }

    if (description) {
        updateData.description = description;
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,

        {
            $set: updateData
        },

        {
            new: true,
            runValidators: true
        }
    );

    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found"
        );
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist updated successfully"
            )
        );
});


// =====================================================
// EXPORT
// =====================================================

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};





// import mongoose, { isValidObjectId } from "mongoose"
// import { Playlist } from "../models/playlist.models.js"
// import { ApiError } from "../utils/ApiError.js"
// import { ApiResponse } from "../utils/ApiResponse.js"
// import { asyncHandler } from "../utils/asyncHandler.js"


// const createPlaylist = asyncHandler(async (req, res) => {

//     console.log("Reached");

//     const { name, description } = req.body

//     console.log("name", name);
//     console.log("description", description);


//     if (!name) {
//         throw new ApiError(200, "PLease eneter the name")
//     }
//     if (!description) {
//         throw new ApiError(200, "PLease eneter the description")
//     }
//     const owner = req.user?._id

//     const playlist = await Playlist.create({ name, description, owner });
//     res
//         .status(201)
//         .json(new ApiResponse(201, playlist, "Playlist created successfully"));


//     //TODO: create playlist
// })

// const getUserPlaylists = asyncHandler(async (req, res) => {
//     const { userId } = req.params
//     //TODO: get user playlists
//     if (!isValidObjectId(userId)) {
//         throw new ApiError(200, "PLease eneter the name")
//     }
//     const playlists = await Playlist.find({
//         owner: userId
//     })
//     res
//         .status(200)
//         .json(
//             new ApiResponse(200, playlists, "User playlists fetched successfully")
//         );
// })

// const getPlaylistById = asyncHandler(async (req, res) => {
//     const { playlistId } = req.params

//     console.log("Reached, getPlaylistById");
//     //TODO: get playlist by id

//     if (!playlistId) {
//         throw new ApiError(200, "PLease playlist")
//     }

//     const play = await Playlist.findById({ playlistId }).populate("video")

//     if (!play) {
//         throw new ApiError(200, "Cannot find the playlist")
//     }

//     res
//         .status(200)
//         .json(
//             new ApiResponse(200, play, "User playlists fetched successfully")
//         );
// })

// const addVideoToPlaylist = asyncHandler(async (req, res) => {
//     const { playlistId, videoId } = req.params
//     console.log("Mudasir is Here");
//     if (!playlistId) {
//         throw new ApiError(200, "Cannot find the playlist")
//     }
//     if (!videoId) {
//         throw new ApiError(200, "Cannot find the playlist")
//     }
//     const add = await Playlist.findByIdAndUpdate(
//         playlistId,
//         {
//             $addToSet: { video: videoId }
//         },
//         {
//             new: true
//         }
//     ).populate("video")

// })

// const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
//     const { playlistId, videoId } = req.params
//     // TODO: remove video from playlist

//     if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
//         throw new ApiError(200, "Cannot find the playlist")
//     }
//     const deleteplay = await Playlist.findByIdAndDelete(
//         playlistId,
//         {
//             $pull: {
//                 video: videoId
//             }
//         },
//         { new: true }
//     ).populate("video")

//     if (!deleteplay) {
//         throw new ApiError(200, "Cannot find the playlist")
//     }
// })

// const deletePlaylist = asyncHandler(async (req, res) => {
//     const { playlistId } = req.params

//     console.log("Reached deletePlaylist",);
//     // TODO: delete playlist

//     const deleteplaylist = await Playlist.findByIdAndDelete(
//         playlistId
//     );
// })

// const updatePlaylist = asyncHandler(async (req, res) => {
//     const { playlistId } = req.params
//     const { name, description } = req.body

//     const update = await Playlist.findByIdAndUpdate(
//         playlistId,
//         {
//             $set:{
//             name:name,
//             description:description
//         }

//     },
//     {new:true}
//     );


//     console.log("REached here");

//     //TODO: update playlist
// })

// export {
//     createPlaylist,
//     getUserPlaylists,
//     getPlaylistById,
//     addVideoToPlaylist,
//     removeVideoFromPlaylist,
//     deletePlaylist,
//     updatePlaylist
// }