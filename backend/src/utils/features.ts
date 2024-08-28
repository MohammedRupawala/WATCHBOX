import jwt, { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import { secretKey } from '../app.js'
import cloudinary from './cloudinary.js'
import { fileUploadType } from '../types/types.js'
import errorHandler from './utilclass.js'
import { NextFunction } from 'express'
import { fileCleanup } from '../middlewares/cleanUp.js'
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
try
{   console.log('File Deleted')
     await  cloudinary.uploader.destroy(id,{resource_type:type})
}  catch(cleanupError){
    console.error('Error While Deleting File',cleanupError)
} 
}



