import jwt, { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import { secretKey } from '../app.js'
import cloudinary from './cloudinary.js'
import {Readable} from 'stream'
import { CloudinaryUploadResult, CustomRequest } from '../types/types.js'
import { NextFunction } from 'express'
import errorHandler from './utilclass.js'
export const connectDB = (uri : string)=>{
    mongoose.connect(uri,{
        dbName:"MediaPlayer"
    }).then(c=>console.log("DB Connected"))
    .catch((e)=>console.log(e))
}

export const generateToken = (id:string)=>{
    const token = jwt.sign({id},secretKey,{expiresIn : '10d'})
    return token;
}
export const verifyToken  = (token: string):string | null=>{
    try {

        const decoded = jwt.verify(token, secretKey);

        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
            return (decoded as JwtPayload).id as string;
        }
        return null;
    } catch (err) {
        return null;
    }
}

export const deleteFromCloudinary = async(id:string,type : string)=>{
     console.log('File Deleted')
     await  cloudinary.uploader.destroy(id,{resource_type:type})
}


export const uploadFile  = (req:CustomRequest,next:NextFunction)  => {
    if(!req.file) return next(new errorHandler('Enter ThumbNail',400))
  cloudinary.uploader.upload(req.file!.path,async(error,result)=>{
    if(error){
        return next(new errorHandler('Error While Uploading',400))
    }
    req.fileInfo!.thumbnailUrl = result?.secure_url
    req.fileInfo!.thumbnailId = result?.public_id

    next()
  })

 
  };



