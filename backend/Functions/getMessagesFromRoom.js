const MessageModel = require("../Models/Message");
async function getMessagesFromRoom(roomId) {
    const messages = await MessageModel.aggregate([
        { $match: { to: roomId } },
        { $group: { _id: '$date', messageByDate: { $push: '$$ROOT' } } }
    ]);
    return messages;
}

module.exports = getMessagesFromRoom;