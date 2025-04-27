const User = require("../models/userModel");
const Message = require("../models/messageModel");
const cloudinary = require("cloudinary").v2;

exports.getUsersForSidedbar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId }
            ]
        }).populate("sender", "-password -__v").populate("receiver", "-password -__v").sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const {text,image} =req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadImage = await cloudinary.uploader.upload(image, {
                folder: "messages",
            });
            imageUrl = uploadImage.secure_url;
        }

        const newMessage = new Message({
            text,
            image: imageUrl,
            sender: senderId,
            receiver: receiverId
        });
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}