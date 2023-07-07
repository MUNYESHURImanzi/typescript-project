import mongoose from "mongoose";

const fileSchema =new mongoose.Schema({
    fileName:{
        type:String
    }
})

export default mongoose.model('file',fileSchema)