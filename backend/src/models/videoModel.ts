import mongoose from "mongoose";

const schema = new mongoose.Schema({
    video:{
        type : String,
        requred:[true,'Enter Video']   
    },
    thumbnail:{
        type : String,
        required : [true]
    },
    videoId:{
        type:String,
        required:[true]
    },
    title : {
        type:String,
        required : [true,'Enter Video Title']
    },
    description : {
        type : String,
        required : [true,'Enter Video Description']
    },
    subject : {
        type : String,
        required : [true,'Enter Video  Subject']
    },
    likes : {
        type : Number,
        requried : [true]
    },
    user : {
        type :String,
        ref:'User',
        required : [true]
    }
},{
    timestamps : true
})


const Video = mongoose.model('Video',schema)
export default Video