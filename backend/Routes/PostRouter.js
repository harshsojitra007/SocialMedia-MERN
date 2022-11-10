const router = require('express').Router();
const PostModel = require('../Models/Post');
const getSuggestedPosts = require("../Functions/getRelevantPostForUser");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});

router.post("/new/post", async (req, res) => {
    const { user, todayDate, urlData, caption } = req.body;
    try {
        if (!user)
            res.status(400).json("Please Log in to continue...");
        else {
            await PostModel.insertMany([{ postOwner: user?.name, postedDate: todayDate, postPicture: urlData, caption: caption }]);
            res.status(200).json("Picture Posted Successfully");
        }
    } catch (ex) {
        res.status(400).json("Error occurred while posting");
    }
});

router.post("/details", async (req, res) => {
    const { id } = req.body;
    try {
        const postDetails = await PostModel.findOne({ _id: id });
        res.status(200).json(postDetails);
    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

router.post("/like", async (req, res) => {

    const { user: user, post: postDetails } = req.body;

    try {
        if (!user)
            res.status(400).json("Please Log in to continue...");
        else {
            const currPost = await PostModel.findOne({ _id: postDetails?._id });
            let isPresent = false, index = -1, i = 0;
            for (const currUser of currPost?.postLikedBy) {
                if (currUser.name === user?.name) {
                    isPresent = true;
                    index = i;
                    break;
                }
                ++i;
            }
            if (index !== -1) {
                currPost?.postLikedBy?.splice(index, 1);
                currPost.likeCount -= 1;
            } else {
                currPost?.postLikedBy?.push({ name: user?.name, picture: user?.picture });
                currPost.likeCount += 1;
            }
            await currPost.save();
            res.status(200).json(currPost);
        }
    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

router.post("/new/comment", async (req, res) => {

    const { user, comment, currPostDetails } = req.body;
    try {
        if (!user)
            res.status(400).json("Please Log in to continue...");
        else {
            const currPost = await PostModel.findOne({ _id: currPostDetails?._id });

            currPost?.comments?.unshift({ commentContent: comment, userPosted: { name: user?.name, picture: user?.picture } });
            await currPost.save();

            res.status(200).json(currPost);
        }

    } catch (err) {
        console.log("error");
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

router.post("/delete", async (req, res) => {
    const { postDetails, user } = req.body;
    try {
        await PostModel.findByIdAndDelete(postDetails?._id);
        let postPicture = postDetails?.postPicture?.split("/");
        postPicture = postPicture[postPicture.length - 1];
        postPicture = postPicture?.split(".")[0];
        cloudinary.v2.uploader.destroy(postPicture, (error, result) => {
            if(error)
                console.log(error);
            if(result)
                console.log("Picture removed from cloud");
        });
        const allPosts = await getSuggestedPosts(user);
        res.status(200).json(allPosts);
    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!")
    }
});

module.exports = router;