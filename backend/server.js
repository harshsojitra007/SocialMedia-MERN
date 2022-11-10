// creates app for backend
const express = require("express");
const app = express();
const cors = require('cors');

// to access data from .env file
require("dotenv").config();

// connects to database
require("./connection");

// models for backend
const User = require("./Models/User");
// const unVerifiedUsers = require("./Models/UnVerifiedUser");

app.use(cors());

// express.urlencoded() parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
// express.json() parses incoming JSON requests and puts the parsed data in req
app.use(express.json());

const UserRouter = require("./Routes/UserRouter");
const PostRouter = require("./Routes/PostRouter");
const FetchRouter = require("./Routes/FetchRouter");
const FriendRouter = require("./Routes/FriendRouter");
const RequestRouter = require("./Routes/RequestRouter");

app.use("/users", UserRouter);
app.use("/p", PostRouter);
app.use("/f", FetchRouter);
app.use("/friend", FriendRouter);
app.use("/request", RequestRouter);

if(process.env.NODE_ENV === "production")
    app.use(express.static("frontend/build"))

// createServer method creates a server on your computer
const server = require('http').createServer(app);

// logic for logout the user
app.delete("/logout", async (req, res) => {
    try {

        const { name } = req.body;
        const user = await User.find({ name: name });
        user[0].status = "Offline";

        await user[0].save();
        res.status(200).send();

    } catch (err) {
        console.log(err);
        res.status(400).send();
    }
});

// defines a port to run backend server
const PORT = process.env.PORT || 5000;

// to listen on user-defined port
server.listen(PORT, () => {
    console.log(`app is listening to port ${PORT}`);
});