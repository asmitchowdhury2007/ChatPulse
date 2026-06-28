import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    senderID : {
        type: mongoose.Schema.Types.ObjectId,
        ref :"users",
        required:true
    },
    receivedID:{
        type: mongoose.Schema.Types.ObjectId,
        ref :"users",
        required:true
    },
    text :{
        type:String,
    },
    image:{
        type:String,
    }

},
    {timestamps:true}  
)

const message = mongoose.model("messages", messageSchema);
export default message;