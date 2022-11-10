const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    content: String,
    from: Object,
    time: String,
    date: String,
    to: String,
    MarkAsRead: {
        type: Boolean,
        default: false,
    },
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;