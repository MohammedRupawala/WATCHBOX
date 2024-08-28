import { NextFunction, Request, Response } from "express";
import Busboy from 'busboy'
import cloudinary from '../utils/cloudinary.js'
import path from 'path'
import { TryCatch } from "./errorHandler.js";
import errorHandler from "../utils/utilclass.js";
import multer, { FileFilterCallback } from "multer";
import { CustomRequest } from "../types/types.js";
import { deleteFromCloudinary } from "../utils/features.js";






const thumbnailId = "images_pcz0p0"
const thumbnailUrl = 'https://res.cloudinary.com/dqy6ffx6k/image/upload/v1724767116/images_pcz0p0.jpg' 
const fields: { [key: string]: string } = {};

export const fileUpload = TryCatch(async (req: CustomRequest, res: Response, next: NextFunction) => {
     
    const bb = Busboy({ headers: req.headers });
    let isAborted = false;
    const uploadPromises: Promise<void>[] = [];
    // Handle request abortion
    req.on('aborted', async () => {
        isAborted = true;
        console.log('Request Aborted');
        if (req.fileInfo?.filePublicId) {
            console.log('Deleting video due to request abortion');
            await  deleteFromCloudinary(req.fileInfo?.filePublicId,'video')
        }
    });

    // Handle form fields
    bb.on('field', (fieldname: string, val: string) => {
        fields[fieldname] = val;
    });

    // Handle file uploads
    bb.on('file', async(fieldname: string, file: NodeJS.ReadableStream, info: { filename: string; encoding: string; mimeType: string }) => {
        const { mimeType } = info;

        // Validate fields before processing the file
        if (!fields.title || !fields.subject || !fields.description) {
            console.log("Insufficient Details");
            file.resume();
            req.unpipe();
            return next(new errorHandler("Insufficient Details", 401));
        }
        

       
        // Validate file type
       if(fieldname == 'Video'){
        if (!['video/mp4'].includes(mimeType)) {
            console.log('Unsupported File Format');
            file.resume();
            req.unpipe();
            return next(new errorHandler('Upload mp4 type', 401));
        }
        
        const cloudinaryStream =  cloudinary.uploader.upload_stream({
            resource_type: 'video'
        }, async (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return next(new errorHandler('Upload Failed', 500));
            }

            // Handle abort during upload
            if (isAborted) {
                console.log('Request Aborted during upload');
                if (result?.public_id) {
                  await  deleteFromCloudinary(result?.public_id,'video')
                }
                 return next(new errorHandler('Request Aborted', 500));
            }

            try {
                if (!req.fileInfo) {
                    req.fileInfo = {};
                }
                req.fileInfo.fileUrl = result?.secure_url || '';
                req.fileInfo.filePublicId = result?.public_id || '';
                
            } catch (dbError) {
                console.error('Database error:', dbError);
                return next(new Error('Error saving video to database'));
            }
        });

        file.pipe(cloudinaryStream);

        file.on('error', (error: Error) => {
            return next(new errorHandler('Error during file upload', 500));
        });
        
       }

       });



    // Handle finish event
    bb.on('finish', async () => {
        // If the request was aborted, handle cleanup
        if (isAborted) {
            console.log('Aborting request after finish');
            if (req.fileInfo?.filePublicId || req.fileInfo?.thumbnailId) {
                await deleteFromCloudinary(req.fileInfo.filePublicId!,'video')
            }
            return next(new errorHandler('Request Aborted', 500));
        }

        req.fileInfo = req.fileInfo || {};
        req.fileInfo.title = fields.title;
        req.fileInfo.description = fields.description;
        req.fileInfo.subject = fields.subject;

        // Validate fields again before completing
        if (!fields.title || !fields.subject || !fields.description) {
            console.log("Insufficient Details");

            if (req.fileInfo?.filePublicId) {
                console.log('Deleting file due to insufficient details');
                try {
                    await cloudinary.uploader.destroy(req.fileInfo.filePublicId, { resource_type: 'video' });
                } catch (error) {
                    console.error('Error deleting video due to insufficient details:', error);
                }
            }
            return next(new errorHandler("Insufficient Details", 401));
        }

        if(req.fileInfo.thumbnailId || req.fileInfo.thumbnailUrl){
            req.fileInfo.thumbnailId = thumbnailId,
            req.fileInfo.thumbnailUrl = thumbnailUrl
        }
        // Wait for all uploads to complete
        try {
            await Promise.all(uploadPromises);
            console.log("File upload completed");
            next();
        } catch (error) {
            // Handle errors and clean up if needed
            if (req.fileInfo?.filePublicId) {
                try {
                    await cloudinary.uploader.destroy(req.fileInfo.filePublicId, { resource_type: 'video' });
                } catch (error) {
                    console.error('Error deleting video on upload failure:', error);
                }
            }
            console.error('File upload incomplete:', error);
            next(error);
        }
    });

    req.pipe(bb);
});





// const storage = multer.diskStorage({
//     destination: (req,res,callback)=>{
//         callback(null, 'uploads/image');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Filename
//     }
// })


// const fileFilter : (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void = (req,file,cb) => {
//     // Accept only image files
//     if (!file.mimetype.startsWith('image/')) {
//         return cb(new Error('Please upload an image file'));
//     }
//     cb(null, true);
// };

// const upload = multer({
//     storage :storage,
//     fileFilter : fileFilter
// })

// export const singleUpload = upload.single('image')






// Multer configuration
const storage = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, 'uploads/image');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Please upload an image file'));
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export const singleUpload = upload.single('image');

