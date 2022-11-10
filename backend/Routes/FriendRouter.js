const router = require('express').Router();
const User = require('../Models/User');

router.post("/", async (req, res) => {

    const { user } = req.body;
    try {
        const currUser = await User.findOne({ name: user?.name });

        const friends = currUser?.friends;
        const length = friends?.length;

        const friendsJson = [];

        for (let i = 0; i < length; ++i) {
            const currFriend = await User.findOne({ name: friends[i] });
            friendsJson.push(currFriend.toJSON());
        }
        res.status(200).json(friendsJson);
    } catch (error) {
        res.status(400).json("Internal Error occurred while processing!!");
    }

});

router.post("/status", async (req, res) => {

    const { user, reqUser } = req.body;
    
    try {
        
        const currUser = await User.findOne({ name: user?.name });
        if(!currUser)
            res.status(200).json("No Relation");
        else if (currUser?.friends?.indexOf(reqUser?.name) !== -1) {
            res.status(200).json("Already Friends");
        } else if (currUser?.requestSent?.indexOf(reqUser?.name) !== -1) {
            res.status(200).json("Friend Request Sent");
        } else if (currUser?.requestsIncomed?.indexOf(reqUser?.name) !== -1) {
            res.status(200).json("Friend Request Incomed");
        } else {
            res.status(200).json("No Relation");
        }

    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }

});

router.post("/add", async (req, res) => {

    const { user, reqForFriend } = req.body;
    try {
        
        const friend = await User.findOne({ name: reqForFriend?.name });
        const loggedInUser = await User.findOne({ name: user?.name });

        if(!loggedInUser)
            res.status(400).json("Please Log in to continue...");
        else{   
            // pushing current user to request property of selected user and notifying the same
            friend?.requestsIncomed?.push(loggedInUser?.name);
            friend?.notifications?.push(`${loggedInUser?.name} sent you a Friend Request`);
            
            // storing data as boolean
            loggedInUser?.requestSent?.push(friend?.name);
            
            // saving both user status
            await friend.save();
            await loggedInUser.save();
            
            res.status(200).json("Request sent successfully");
        }
            
    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }

});

router.post("/accept", async (req, res) => {

    const { currUser, requestedUser } = req.body;

    try {

        // fetching both user objects
        const loggedInUser = await User.findOne({ name: currUser?.name });
        const secondUser = await User.findOne({ name: requestedUser?.name });

        // finding pos of requested user in Requests Array
        const userIndex = loggedInUser?.requestsIncomed?.indexOf(secondUser?.name);
        // Removing that User from the Array
        loggedInUser?.requestsIncomed?.splice(userIndex, 1);

        // Pushing into Friends Array to both users
        loggedInUser?.friends?.push(secondUser?.name);
        secondUser?.friends?.push(loggedInUser?.name);

        // deleting pending request object
        const indexOfRequest = secondUser?.requestSent?.indexOf(loggedInUser?.name);

        if (indexOfRequest !== -1)
            secondUser?.requestSent?.splice(indexOfRequest, 1);

        // sending notification to user
        secondUser?.notifications?.push(`${loggedInUser?.name} accepted your Friend Request`);

        // saving both user status
        await loggedInUser.save();
        await secondUser.save();

        res.status(200).json("Friend request accepted");

    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }

});

router.post("/delete", async (req, res) => {

    const { currUser, requestedUser } = req.body;

    try {

        // fetching both user objects
        const loggedInUser = await User.findOne({ name: currUser?.name });
        const secondUser = await User.findOne({ name: requestedUser?.name });

        // finding pos of requested user in Requests Array
        const userIndex = loggedInUser?.requestsIncomed?.indexOf(secondUser?.name);
        // Removing that User from the Array
        if (userIndex !== -1)
            loggedInUser?.requestsIncomed?.splice(userIndex, 1);

        // deleting pending request object
        const sentIndex = secondUser?.requestSent?.indexOf(loggedInUser?.name);
        if (sentIndex !== -1)
            secondUser.requestSent.splice(sentIndex, 1);

        // sending notification to user
        secondUser?.notifications?.push(`${loggedInUser?.name} denied your Friend Request`);

        // saving both user status
        await loggedInUser.save();
        await secondUser.save();

        res.status(200).json("Friend request deleted");

    } catch (err) {
        console.log(err);
        res.status(400).json("Internal Error occurred while processing!!");
    }

});

router.post("/cancel", async (req, res) => {

    const { currUser, requestedUser } = req.body;

    try{

        // fetching both user objects
        const loggedInUser = await User.findOne({ name: currUser?.name });
        const secondUser = await User.findOne({ name: requestedUser?.name });
        
        const userIndex = loggedInUser?.requestSent?.indexOf(secondUser?.name);
        if (userIndex !== -1)
        loggedInUser?.requestSent?.splice(userIndex, 1);
        
        const sentUserIndex = secondUser?.requestsIncomed?.indexOf(loggedInUser?.name);
        if (sentUserIndex !== -1)
        secondUser?.requestsIncomed?.splice(sentUserIndex, 1);
        
        await loggedInUser.save();
        await secondUser.save();
        
        res.status(200).json("Request cancelled");
        
    }catch(err){
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

router.post("/remove", async (req, res) => {

    const { user, friend } = req.body;

    try {

        const currUser = await User.findOne({ name: user?.name });
        const currFriend = await User.findOne({ name: friend?.name });

        const friendIndex = currUser?.friends?.indexOf(currFriend?.name);
        currUser?.friends?.splice(friendIndex, 1);

        const userIndex = currFriend?.friends?.indexOf(currUser?.name);
        currFriend?.friends?.splice(userIndex, 1);

        await currUser.save();
        await currFriend.save();

        res.status(200).json("Removed from friends successfully");

    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }

});

router.post("/mutual/count", async (req, res) => {
    const { currUser, reqUser } = req.body;

    try {

        const user = await User.findOne({ name: currUser?.name }), otherUser = await User.findOne({ name: reqUser?.name });
        if(!user)
            res.status(200).json({ mutualCount: 0});
        else{
            let mutualCount = 0;
            for (let friend of user?.friends)
                if (otherUser?.friends?.indexOf(friend) !== -1)
                    ++mutualCount;
            res.status(200).json({ mutualCount: mutualCount });
        }

    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }

});

module.exports = router;