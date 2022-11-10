const getMessagesFromRoom = require("../Functions/getMessagesFromRoom");
const getMutualFriends = require("../Functions/getMutualFriends");
const getAllUsersNames = require("../Functions/getAllUserNames");
const getSuggestedPosts = require("../Functions/getRelevantPostForUser");
const router = require('express').Router();
const User = require('../Models/User');
const PostModel = require("../Models/Post");

router.post("/current/state", async (req, res) => {
    const { userName } = req.body;
    try {
        const currUser = await User.findOne({ name: userName });
        res.status(200).json(currUser);
    } catch (error) {
        res.status(400).json("Error occurred while processing");
    }
});

router.post("/posts", async (req, res) => {

    const { user } = req.body;
    try {
        const allPosts = await getSuggestedPosts(user);
        res.status(200).json(allPosts);
    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

router.post("/messages", async (req, res) => {
    const { roomId } = req.body;
    try {
        const messages = await getMessagesFromRoom(roomId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json("Error occurred while processing");
    }
});

router.get("/messages/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    try {
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
        };
        res.writeHead(200, headers);
        const messages = await getMessagesFromRoom(roomId);
        res.write(messages);
    } catch (error) {
        res.status(400).json("Error occurred while processing");
    }
});

router.post("/connection", async (req, res) => {
    const { user } = req.body;

    try {
        const currUser = await User.findOne({ name: user?.name });
        let allUsers = await getMutualFriends(currUser), tempAll = allUsers, onlyKeys = [];

        tempAll[currUser?.name] = -1;
        for (const names in allUsers)
            onlyKeys.push(names);

        allUsers = onlyKeys;
        if (currUser) {

            const userRequested = currUser?.requestSent;
            for (let i in userRequested)
                tempAll[userRequested[i]] = -1;

            const userFriends = currUser?.friends;
            for (let i = 0; i < userFriends?.length; ++i)
                tempAll[userFriends[i]] = -1;

            const pendingRequests = await currUser?.requestsIncomed;
            for (let i = 0; i < pendingRequests?.length; ++i)
                tempAll[pendingRequests[i]] = -1;
        }
        let mySet = new Map();
        for (let i in tempAll) {
            if (mySet.get(tempAll[i]) === undefined)
                mySet.set(tempAll[i], i);
            else
                mySet.set(tempAll[i], (mySet.get(tempAll[i]) + " " + i));
        }

        const allUsersJson = [];

        let itr = mySet.entries();
        let names;
        while (names = itr.next().value) {
            if (names[0] < 0)
                continue;

            names = names[1]?.split(" ");

            for (let i = 0; i < names.length; ++i) {
                const foundUser = await User.findOne({ name: names[i] });
                allUsersJson.push(foundUser.toJSON());
            }
        }
        res.status(200).json(allUsersJson);
    } catch (error) {
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

router.post("/usernames", async (req, res) => {
    try {

        const allUsersNames = await getAllUsersNames();
        res.status(200).json(allUsersNames);

    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

router.post("/friends", async (req, res) => {
    const { user } = req.body;

    try {
        const currUser = await User.findOne({ name: user?.name });

        if (!currUser)
            throw new Error("Please Login to proceed!!");

        const friends = currUser?.friends;
        const length = friends?.length;

        const friendsJson = [];

        for (let i = 0; i < length; ++i) {
            const currFriend = await User.findOne({ name: friends[i] });
            friendsJson.push(currFriend?.toJSON());
        }
        res.status(200).json(friendsJson);
    } catch (error) {
        console.log(error);
        res.status(400).json("Internal Error occurred while processing!");
    }
});

router.post("/friendship/status", async (req, res) => {

    const { user, reqUser } = req.body;
    const currUser = await User.findOne({ name: user?.name });

    try {

        if (currUser?.friends?.indexOf(reqUser?.name) !== -1) {
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

router.post("/user/posts", async (req, res) => {
    const { user } = req.body;
    try {
        let posts = await PostModel.aggregate([
            { $match: { postOwner: user } },
        ]);
        res.status(200).json(posts);
    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

module.exports = router;