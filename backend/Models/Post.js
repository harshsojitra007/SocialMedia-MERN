const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({

    postOwner : {
        type: String,
    },

    likeCount: {
        type: Number,
        default: 0,
    },

    postedDate : {
        type: Date,
    },

    caption : {
        type: String,
        default: "",
    },

    comments: {
        type: Array,
        default: [],
    },

    postPicture : {
        type: String,
    },

    postLikedBy : {
        type: Array,
        default: [],
    }
}, {minimize: false});

const PostModel = mongoose.model("PostModel", PostSchema);
module.exports = PostModel;