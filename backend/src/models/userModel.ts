import mongoose from 'mongoose'
import validator from 'validator'
const userSchema = new mongoose.Schema({
    _id : {
        type : String,
        required : [true,'Enter Id']
    },
    name : {
        type : String,
        required : [true,'Enter Name']
    },
    email : {
        type : String,
        required : [true,'Enter Unique Email'],
        validate : validator.default.isEmail,
        unique : [true,"Email Already Exist"]
    },
    password : {
        type : String,
        required : [true,'Enter Password'],
        minlength: [8, 'Password must be at least 8 characters long'],
        match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[^\w\s]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ],
    },
    image : {
        type : String,
        required : [true]
    }
},{
    timestamps : true
})

const User = mongoose.model('User', userSchema);

export default User;