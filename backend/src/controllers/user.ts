import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/errorHandler.js";
import { newUserType, userSignInType } from "../types/types.js";
import {v4 as uuid} from "uuid"
import fs from "fs"
import {compare, hash} from 'bcrypt'
import errorHandler from "../utils/utilclass.js";
import User from "../models/userModel.js";
import { generateToken } from "../utils/features.js";
export const validatePassword = (password:string) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[^\w\s]).{8,}$/;
    return regex.test(password);
};
export const newUser = TryCatch(async(req:Request<{},{},newUserType>,res : Response,next : NextFunction)=>{
   
    const {name,email,password} = req.body
    const _id =  uuid()
    const image = req.file
    const isValid = validatePassword(password)
    if(!isValid) {
        if(image && image.path) fs.unlinkSync(image.path)
        return next(new errorHandler("Password must Contain 1 Upper,Lower,Number,Character",406))
    }
    const emailExists = await User.findOne({email})
    if(emailExists){
        if(image && image.path) fs.unlinkSync(image.path)
        return next(new errorHandler("Email Already Exists",406))
    }
    if(!name || !email || !_id || !password || !image){ 
        if(image && image.path) fs.unlinkSync(image.path)
        return next(new errorHandler("Enter All Details",412))}

   try{
    const hashPassword = await hash(password,10)
    const user =await User.create({
        _id,
        name,
        email,
        password : hashPassword,
        image:image?.path
    })

    const token = generateToken(_id)

    res.json({
        success : true,
        token,
        message : `User Created with User Name ${name}`
    })
   }
   catch(error){
    if(image && image.path) fs.unlinkSync(image.path)
        next(error)
   }
})


export const userSignIn = TryCatch(async(req:Request<{},{},userSignInType>,res:Response,next:NextFunction)=>{
    const {email,password} = req.body
    const userEmail = await User.findOne({email})
    if(!userEmail) return next(new errorHandler("No User Exists,Please Sign UP",406))
    const  isMatch = await compare(password,userEmail.password)
    console.log(isMatch)
    if(!isMatch) return next(new errorHandler('Incorrect Password',401))
    const token = generateToken(userEmail._id)
    return res.status(200).json({
        success : true,
        token,
        message:`Welcome ${userEmail.name}`
    })
})