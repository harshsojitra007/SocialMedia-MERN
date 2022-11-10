const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({

    // defines documents in mongodb
    name: {
        type: String,
        required: [true, "Can't be Empty"],
    },

    email: {
        type: String,
        required: [true, "Can't be Empty"],
        unique: true,
        index: true,
        lowercase: true,
        validate: [isEmail, "Invalid Email Address"],
    },

    password: {
        type: String,
        required: [true, "Can't be Empty"],
    },

    picture: {
        type: String,
        default: "https://res.cloudinary.com/dhdhpzhtq/image/upload/v1660634316/yzahwch3mxnq8mnvfcx2.jpg",
    },

    status: {
        type: String,
        default: 'Online',
    },

    unreadMessages: {
        type: Array,
        default: [],
    },

    notifications: {
        type: Array,
        default: [],
    },

    requestsIncomed: {
        type: Array,
        default: [],
    },

    requestSent: {
        type: Array,
        default: [],
    },

    friends: {
        type: Array,
        default: [],
    },

    currentRoom: {
        type: String,
        default: null,
    },

    bio: {
        type: String,
        default: "",
    },

    isGenderMale: {
        type: Boolean,
        default: true,
    },
},
{minimize: false}
);

UserSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.notifications;
    delete userObject.requestsIncomed;
    delete userObject.requestSent;
    delete userObject.unreadMessages;

    return userObject;
}

UserSchema.statics.isAlreadyExist = async function(email){
    const user = await User.find({email: email});

    if(user[0])
        return true;
    else
        return false;
}

UserSchema.statics.findByCredentials = async function(name, password){
    const user = await User.findOne({name: name});

    if(!user)
        throw new Error("User Not Exist!!");

    // compares input password with DB password and returns the result
    const matched = await bcrypt.compare(password, user.password);

    if(matched)
        return user;
    else
        throw new Error("Invalid Password!!");
}

const User = mongoose.model("User", UserSchema);
module.exports = User;