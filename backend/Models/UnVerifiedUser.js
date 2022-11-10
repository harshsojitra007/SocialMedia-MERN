const mongoose = require('mongoose');
const { isEmail } = require('validator');

const UnVerifiedUserSchema = mongoose.Schema({

    // defines documents in mongodb
    name: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
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

    token: {
        type: String,
        default: "undefined",
    }
},
{minimize: false}
);

UnVerifiedUserSchema.statics.isAlreadyExist = async function(email){
    const user = await UnVerifiedUser.find({email: email});

    if(!user[0])
        return true;
    else
        return false;
}

const UnVerifiedUser = mongoose.model("UnVerifiedUser", UnVerifiedUserSchema);
module.exports = UnVerifiedUser;