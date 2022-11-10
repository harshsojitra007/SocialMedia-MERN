const router = require('express').Router();
const User = require('../Models/User');
const UnVerifiedUser = require("../Models/UnVerifiedUser");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const getMessagesFromRoom = require("../Functions/getMessagesFromRoom");
const sortMessagesByDate = require("../Functions/sortMessagesByDate");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});

// to hash password for newly signed up user
const bcrypt = require('bcrypt');
async function hashPassword(password) {
    const hashedPass = bcrypt.hash(password, 10);
    return hashedPass;
}

router.get("/verify/:jwtkey/:secretkey", async (req, res) => {
    const jwtKey = new URLSearchParams(req.params.jwtkey), secretKey = new URLSearchParams(req.params.secretkey);
    let jwtString = jwtKey.toString(), secretString = secretKey.toString();

    jwtString = jwtString.substring(0, (jwtString.length - 1));
    secretString = secretString.substring(0, (secretString.length - 1));

    jwt.verify(jwtString, secretString, async (err, data) => {
        if (err) {
            console.log(err);

            await UnVerifiedUser.findOneAndDelete({ name: secretString });
            res.status(400).json("Link Expired! Please try to create an account again");
        }
        else {
            console.log(data);
            const user = await UnVerifiedUser.findOne({ name: secretString });

            const isAlreadyExist = await User.isAlreadyExist(user.name);
            if (isAlreadyExist)
                throw new Error("User already exist!");

            const hashedPass = await hashPassword(user.password.toString());

            const successUser = await User.insertMany([{ name: user.name, email: user.email, password: hashedPass }]);
            await successUser[0].save();

            // UnVerifiedUser.deleteOne({name: secretString});
            await UnVerifiedUser.findOneAndDelete({ name: successUser[0].name });

            res.status(200).json("Account Verified Successfully");
        }
    });
});

router.post("/unverified", async (req, res) => {

    const { name, email, password } = req.body;
    try {

        const unVerifiedUser = await UnVerifiedUser.findOne({ name: name });
        if (unVerifiedUser)
            throw new Error("A verification mail has been already sent!");

        const unVerifiedUserEmail = await UnVerifiedUser.findOne({ email: email });
        if (unVerifiedUserEmail)
            throw new Error("A verification mail has been already sent!");

        const isVerifiedUser = await User.findOne({ name: name });
        if (isVerifiedUser)
            throw new Error("User with provided username already exist!");

        const isVerifiedUserEmail = await User.findOne({ email: email });
        if (isVerifiedUserEmail)
            throw new Error("User with provided E-mail Already Exist!");


        const newlyUnVerified = await UnVerifiedUser.insertMany([{ name: name, email: email, password: password }]);
        const secretKey = newlyUnVerified[0].name.toString();

        const tempToken = jwt.sign({ name: newlyUnVerified[0].name }, secretKey, {
            expiresIn: '2h',
        });

        newlyUnVerified[0].token = tempToken;
        await newlyUnVerified[0].save();

        const verificationLink = `http://localhost:5000/users/verify/${tempToken}/${secretKey}`;

        // Mail Sending Logic
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailConfigurations = {
            from: 'react.chat.team@gmail.com',
            to: email,
            subject: 'Verify your Account',
            html: `
                <html>
                <body>
                    Hello ${name},
                    <br />
                
                        We've got an request to join RxChat for this Email. Click the below Verification Link to join with us,
                        <br />

                            <a href='${verificationLink}'>Click Here</a>
                        
                        <br />
                        If this wasn't you please report this activity using below link,
                        <br />
                            <a href='http://localhost:3000/report'>Click Here</a>
                        <br />
                    Regards,
                    RxChat Team
                </html>
                </body>
            `
        };

        transporter.sendMail(mailConfigurations, (err, info) => {
            if (err)
                throw err;
        });

        res.status(200).json(tempToken);

    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
});

// get match for path "/users/login"
router.post("/login", async (req, res) => {

    const { userName, password } = req.body;
    try {
        const user = await User.findByCredentials(userName, password);

        user.status = "Online";
        await user.save();

        res.status(200).json(user);

    } catch (error) {
        res.status(400).json(error.message);
    }

});

router.post("/last/message", async (req, res) => {

    const { roomId } = req.body;

    try {

        let roomMessages = await getMessagesFromRoom(roomId);
        roomMessages = await sortMessagesByDate(roomMessages);

        let lastMessage = "";
        const messages = Array.of(roomMessages[0])[0]
        if (roomMessages.length)
            lastMessage = (await (roomMessages[roomMessages.length - 1]).toString()).substring(0, Math.min(13, (await (roomMessages[roomMessages.length - 1]).toString()).length)) + "...";

        res.status(200).json(lastMessage);

    } catch (err) {
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

router.post("/update/profile", async (req, res) => {
    const { userPicture, userName, userBio, userDetails } = req.body;
    try{
        const currUser = await User.findOne({ name: userDetails?.name });

        if(currUser?.picture !== process.env.DEFAULT_PROFILE_PIC && userPicture !== currUser?.picture){
            let currPicture = currUser?.picture?.split("/");
            currPicture = currPicture[currPicture.length - 1];
            currPicture = currPicture?.split(".")[0];
            cloudinary.v2.uploader.destroy(currPicture, (error, result) => {
                if(error)
                    console.log(error);
                if(result)
                    console.log("Picture removed from cloud");
            });
        }
        
        currUser.picture = userPicture;
        currUser.bio = userBio;

        await currUser.save();
        res.status(200).json(currUser);
    }catch(err){
        console.log(err);
        res.status(400).json("Internal Error occurred while processing!!");
    }
});

module.exports = router;