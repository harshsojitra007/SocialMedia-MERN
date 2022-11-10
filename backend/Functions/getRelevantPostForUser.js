const PostModel = require("../Models/Post");
const UserModel = require("../Models/User");

async function getSuggestedPosts(user){
    let mySet = new Map();
    const allPosts = [];
    const currUser = await UserModel.findOne({ name: user?.name });
    const friends = currUser?.friends;

    let posts = await PostModel.aggregate([
        { $match: { postOwner: currUser?.name } },
    ]);
    for(let currPost of posts){
        if(mySet.get(currPost._id) === undefined){
            const postOwner = await UserModel.findOne({ name: currPost?.postOwner });
            allPosts.push({ postId: { postOwnerDetails: postOwner, postDetails: currPost } });
            mySet.set(currPost._id, 1);
        }
    }
    for(const currFriend of friends){
        posts = await PostModel.aggregate([
            { $match: { postOwner: currFriend } },
        ]);
        for(let currPost of posts){
            if(mySet.get(currPost._id) === undefined){
                const postOwner = await UserModel.findOne({ name: currPost?.postOwner });
                allPosts.push({ postId: { postOwnerDetails: postOwner, postDetails: currPost } });
                mySet.set(currPost._id, 1);
            }
        }
    }
    return allPosts;
}

module.exports = getSuggestedPosts;