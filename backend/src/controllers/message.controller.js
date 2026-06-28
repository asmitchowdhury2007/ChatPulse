import message from "../models/message.js"
import user from "../models/user.js"
import cloudinary from"../lib/cloudinary.js"

async function getAllContacts(req,res){
    const loggedInUserID = req.user._id;
    const AllContacts = await user.find({_id :{$ne : loggedInUserID}}).select("-password");
    return res.status(200).json({contacts: AllContacts});

}

async function chatPartners(req,res){
    const loggedInUserID = req.user._id;
    const messages = await message.find({
        $or: [
            { senderID: loggedInUserID },
            { receivedID: loggedInUserID },
        ],
    })
    const chatPartnerIDs = [...new Set(messages.map(message => message.senderID.toString() === loggedInUserID.toString() ? message.receivedID.toString() : message.senderID.toString()))];
    const chatPartners = await user.find({_id:{$in : chatPartnerIDs}}).select("-password");
    return res.status(200).json({message : chatPartners});
}

async function getMessageByID(req,res){
    const loggedInUserID = req.user._id;
    const FriendID = req.params.id;
    const Allmessages = await message.find({
        $or : [
            {senderID : loggedInUserID , receivedID : FriendID},
            {senderID : FriendID , receivedID : loggedInUserID},
        ]
    }).sort({createdAt : 1});
    return res.status(200).json({messages : Allmessages });
}

async function sendMessage(req,res){
    const senderID = req.user._id;
    const receivedID = req.params.id;
    const {text,image} = req.body;
    if(!text && !image) return res.status(400).json({message : "Message can't be empty"});
    let imageURL = null;
    if(image){
        const imageUpload = await cloudinary.uploader.upload(image);
        imageURL = imageUpload.secure_url
    }
    const sendMessage = await message.create({
        senderID,
        receivedID,
        text,
        image : imageURL,
    });

    return res.status(201).json({ message: sendMessage });
}

export {
    getAllContacts,
    chatPartners,
    getMessageByID,
    sendMessage
}