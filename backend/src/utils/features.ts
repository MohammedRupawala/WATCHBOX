import jwt, { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import { secretKey } from '../app.js'
import cloudinary from './cloudinary.js'
import {Readable} from 'stream'
import {  CustomRequest } from '../types/types.js'
import { Request,Response,NextFunction } from 'express'
import errorHandler from './utilclass.js'
import { TryCatch } from '../middlewares/errorHandler.js'
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



    export const  CloudinaryUploadResult = async(filePath : string,fileType : "image" | "video")=>{
        try {
            // const result = await cloudinary.uploader.upload_large(filePath, {
            //     resource_type: fileType
            // });
            // console.log("Cloudinary Upload Result:", result.secure_url);
            // return result;
            const result = await cloudinary.uploader.upload(filePath, {
                resource_type: fileType,
                chunk_size: 5000000,  // Adjust as needed
            });

            if (!result || !result.secure_url || !result.public_id) {
                throw new Error('Cloudinary upload result is missing required fields.');
            }

            console.log('Upload Successful:', result);
            return {
                secure_url: result.secure_url,
                public_id: result.public_id,
            };
        } catch (error) {
            console.error('Error while uploading to Cloudinary:', error);
            throw new Error('Error while uploading to Cloudinary');
        }
    }


