const router = require('express').Router();
const User = require('../Models/User');
const MessageModel = require('../Models/Message');
const PostModel = require("../Models/Post");

const getMessagesFromRoom = require("../Functions/getMessagesFromRoom");
const sortMessagesByDate = require("../Functions/sortMessagesByDate");

router.post("/pending", async (req, res) => {

    const { user } = req.body;

    try {

        const currUser = await User.find({ name: user?.name });

        const pendingRequests = await currUser[0]?.requestsIncomed;
        const length = pendingRequests?.length;

        const pendingRequestsJson = [];

        for (let i = 0; i < length; ++i) {
            const requestedUser = await User.find({ name: pendingRequests[i] });
            pendingRequestsJson.push(requestedUser[0].toJSON());
        }
        res.status(200).json(pendingRequestsJson);

    } catch (err) {
        console.log(err);
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

router.post("/sent", async (req, res) => {

    const { user } = req.body;
    try {

        const currUser = await User.findOne({ name: user?.name });
        const requestLogs = currUser?.requestSent;
        const length = requestLogs?.length;

        const requestLogsJson = [];

        for (let i = 0; i < length; ++i) {
            const requestedUser = await User.findOne({ name: requestLogs[i] });
            requestLogsJson.push(requestedUser.toJSON());
        }
        res.status(200).json(requestLogsJson);

    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }

});

router.post("/join/room", async (req, res) => {

    const { currUser, roomId } = req.body;

    try {

        const user = await User.findOne({ name: currUser?.name });
        if (roomId !== null) {

            const indexOfFriend = [];

            for (let i in user?.unreadMessages) {
                if ((user?.unreadMessages[i])?.split(":")[0] === roomId)
                    indexOfFriend?.unshift(i);
            }
            for (let indexes of indexOfFriend)
                user?.unreadMessages?.splice(indexes, 1);

            user.currentRoom = await roomId.toString();

        } else {
            user.currentRoom = null;
        }

        await user.save();

        if (roomId !== null) {
            let roomMessages = await getMessagesFromRoom(roomId);
            roomMessages = await sortMessagesByDate(roomMessages);

            res.status(200).json(roomMessages);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(`Internal Error occurred while processing!!`);
    }

});

router.post("/message", async (req, res) => {

    const { room, content, sender, time, date, receiver } = req.body;

    try {
        await MessageModel.create({ content: content, from: sender?.name, time: time, date: date, to: room });

        const receiverFriend = await User.findOne({ name: receiver?.name });
        const senderFriend = await User.findOne({ name: sender?.name });

        const listIndex = receiverFriend?.friends?.indexOf(senderFriend?.name);
        const currListIndex = senderFriend?.friends?.indexOf(receiverFriend?.name);

        if (currListIndex !== -1) {
            senderFriend?.friends?.splice(currListIndex, 1);
            senderFriend?.friends?.unshift(receiverFriend?.name);

            await senderFriend.save();
        }

        if (listIndex !== -1) {
            receiverFriend?.friends?.splice(listIndex, 1);
            receiverFriend?.friends?.unshift(senderFriend?.name);

            await receiverFriend.save();
        }

        let roomMessages = await getMessagesFromRoom(room);
        roomMessages = await sortMessagesByDate(roomMessages);

        if (receiverFriend?.currentRoom !== room) {
            if (receiverFriend?.unreadMessages[room] === undefined)
                receiverFriend.unreadMessages[room] = [];

            receiverFriend?.unreadMessages?.push(room + ":" + content);
            await receiverFriend.save();
        }

        res.status(200).json(roomMessages);

    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }

});

module.exports = router;