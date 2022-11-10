const User = require("../Models/User");
const unVerifiedUsers = require("../Models/UnVerifiedUser");
const jwt = require("jsonwebtoken");

async function getAllUsersNames() {
    const allUsers = await User.find();
    const unverified = await unVerifiedUsers.find();

    for(let i=0;i<unverified.length;++i){
        jwt.verify(unverified[i].token, unverified[i].name, async (err, data) => {
            if(err){
                await unVerifiedUsers.deleteOne({ name: unverified[i].name });
                unverified.splice(i, 1);
                --i;
            }
        });
    }
    const allUsersNames = [];

    for (let i = 0; i < allUsers.length; ++i)
        allUsersNames.push(allUsers[i].name);
    for (let i = 0; i < unverified.length; ++i)
        allUsersNames.push(unverified[i].name);
    return allUsersNames;
}

module.exports = getAllUsersNames;