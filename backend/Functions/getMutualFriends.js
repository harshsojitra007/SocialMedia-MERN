const User = require("../Models/User");

// fetch all User's
async function getAllUsers() {
    const allUsers = await User.find();
    const allUsersJson = [];

    for (let i = 0; i < allUsers.length; ++i)
        allUsersJson.push(allUsers[i].name);
    return allUsersJson;
}

async function getMutualFriends(currUser) {
    let myMap = new Map();
    const allUsers = await getAllUsers();

    for (const all of allUsers)
        myMap.set(all, 0);

    const user = await User.findOne({ name: currUser?.name });
    const userFriends = user?.friends;
    
    for (let friend of userFriends) {

        const userFriend = await User.findOne({ name: friend });
        const mutualFriends = userFriend?.friends;

        for (let mutuals of mutualFriends) {
            myMap.set(mutuals, (myMap.get(mutuals) + 1));
        }
    }
    const mutuals = [];
    myMap.forEach((value, key) => {
        mutuals[key] = value;
    });
    return mutuals;
}

module.exports = getMutualFriends;