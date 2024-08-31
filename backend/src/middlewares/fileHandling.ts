import { NextFunction, Request, Response } from "express";
import Busboy from 'busboy';
import cloudinary from '../utils/cloudinary.js';
import { TryCatch } from "./errorHandler.js";
import errorHandler from "../utils/utilclass.js";
import { deleteFromCloudinary } from "../utils/features.js";
import { CustomRequest } from "../types/types.js";

export const fileUpload = TryCatch(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const bb = Busboy({ headers: req.headers });
    let isAborted = false;
    const fields: { [key: string]: string } = {};
    req.fileInfo = req.fileInfo || {};

    req.on('aborted', async () => {
        isAborted = true;
        console.log('Request Aborted');
        try {
            if (req.fileInfo?.filePublicId) {
                await deleteFromCloudinary(req.fileInfo.filePublicId, 'video');
            }
            if (req.fileInfo?.thumbnailId) {
                await deleteFromCloudinary(req.fileInfo.thumbnailId, 'image');
            }
        } catch (error) {
            return next(new errorHandler('Error While Deleting Files', 500));
        }
    });

    bb.on('field', (fieldname: string, val: string) => {
        fields[fieldname] = val;
    });

    const uploadPromises: Promise<void>[] = [];

    bb.on('file', (fieldname: string, file: NodeJS.ReadableStream, info: { filename: string; encoding: string; mimeType: string }) => {
        const { mimeType } = info;

        if (!fields.title || !fields.description || !fields.subject) {
          console.log("InSufficent Details")
          return next(new errorHandler('Enter All Details',400))
        }
        if (fieldname === 'video') {
            if (!['video/mp4'].includes(mimeType)) {
                console.log('Unsupported Video Type');
                file.resume();
                req.unpipe();
                return next(new errorHandler('Upload Mp4 Type', 400));
            }
            const uploadPromise = new Promise<void>((resolve, reject) => {
                const cloudinaryUpload = cloudinary.uploader.upload_stream({ resource_type: 'video' }, async (error, result) => {
                    if (error) {
                        return reject(new errorHandler('Error While Uploading Video to Cloudinary', 400));
                    }
                    if (isAborted) {
                        if (result?.secure_url) {
                            await deleteFromCloudinary(result?.public_id, 'video');
                        }
                        return reject(new errorHandler('Request Aborted', 400));
                    }

                    req.fileInfo!.filePublicId = result?.public_id || " ";
                    req.fileInfo!.fileUrl = result?.secure_url || " ";
                    resolve();
                });

                file.pipe(cloudinaryUpload);
                file.on('error', (error) => {
                    reject(new errorHandler('Error While Uploading Video', 400));
                });
            });

            uploadPromises.push(uploadPromise);
        } else if (fieldname === 'thumbnail') {
            if (!['image/png', 'image/jpg'].includes(mimeType)) {
                console.log('Unsupported Image Type');
                file.resume();
                req.unpipe();
                return next(new errorHandler('Upload JPG/PNG Type', 400));
            }

            const uploadPromise = new Promise<void>((resolve, reject) => {
                const cloudinaryUpload = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
                    if (error) {
                        return reject(new errorHandler('Error While Uploading Thumbnail to Cloudinary', 400));
                    }
                    if (isAborted) {
                        if (result?.secure_url) {
                            await deleteFromCloudinary(result?.public_id, 'image');
                        }
                        return reject(new errorHandler('Request Aborted', 400));
                    }

                    req.fileInfo!.thumbnailId = result?.public_id || " ";
                    req.fileInfo!.thumbnailUrl = result?.secure_url || " ";
                    resolve();
                });

                file.pipe(cloudinaryUpload);
                file.on('error', (error) => {
                    reject(new errorHandler('Error While Uploading Thumbnail', 400));
                });
            });

            uploadPromises.push(uploadPromise);
        }
    });

    bb.on('finish', async () => {
        try {
            await Promise.all(uploadPromises);

            if (isAborted) {
                if (req.fileInfo?.filePublicId) {
                    await deleteFromCloudinary(req.fileInfo.filePublicId, 'video');
                }
                if (req.fileInfo?.thumbnailId) {
                    await deleteFromCloudinary(req.fileInfo.thumbnailId, 'image');
                }
                return next(new errorHandler('Request Aborted', 500));
            }

            req.fileInfo!.description = fields.description;
            req.fileInfo!.subject = fields.subject;
            req.fileInfo!.title = fields.title;

            if (!fields.title || !fields.description || !fields.subject) {
                try {
                    if (req.fileInfo?.filePublicId) {
                        await deleteFromCloudinary(req.fileInfo.filePublicId, 'video');
                    }
                    if (req.fileInfo?.thumbnailId) {
                        await deleteFromCloudinary(req.fileInfo.thumbnailId, 'image');
                    }
                } catch (error) {
                    return next(new errorHandler('Error While Deleting Files', 500));
                }
            }

            console.log(req.fileInfo?.filePublicId);
            console.log('File Upload Complete');
            next();
        } catch (error) {
            next(error);
        }
    });
    req.pipe(bb);
});




// import { NextFunction, Request, Response } from "express";
// import Busboy from 'busboy'
// import cloudinary from '../utils/cloudinary.js'
// import path from 'path'
// import { TryCatch } from "./errorHandler.js";
// import errorHandler from "../utils/utilclass.js";
// import multer, { FileFilterCallback } from "multer";
// import { CloudinaryUploadResult, CustomRequest } from "../types/types.js";
// import { deleteFromCloudinary } from "../utils/features.js";
// import { CloudinaryStorage } from 'multer-storage-cloudinary';





// const thumbnailId = "images_pcz0p0"
// const thumbnailUrl = 'https://res.cloudinary.com/dqy6ffx6k/image/upload/v1724767116/images_pcz0p0.jpg' 

// export const fileUpload = TryCatch(async (req: CustomRequest, res: Response, next: NextFunction) => {
     
//     const bb = Busboy({ headers: req.headers });
//     let isAborted = false;
//     const fields: { [key: string]: string } = {};
//     req.fileInfo = req.fileInfo || {};
//     req.on('aborted',async()=>{
//         isAborted = true
//         console.log('Req Aborted')
//         try{
//            if(req.fileInfo?.filePublicId) await deleteFromCloudinary(req.fileInfo?.filePublicId,'video')
//         }catch(error){
//            return next(new errorHandler('Error While Deleting Video',500))
//         }
//     })

//     bb.on('field', (fieldname: string, val: string) => {
//         fields[fieldname] = val;
//     });

//     const uploadPromises: Promise<void>[] = [];

//     bb.on('file',(fieldname: string, file: NodeJS.ReadableStream, info: { filename: string; encoding: string; mimeType: string })=>{
//         const {mimeType} = info

//         // if(!fields.title || !fields.description || !fields.subject){
//         //     console.log('Insufficient Details')
//         //     file.resume();
//         //     req.unpipe();
//         //     return next(new errorHandler('Enter All Details',400))
//         // }

//        if(fieldname == 'video'){ 

//         if(!fields.title || !fields.description || !fields.subject){
//             console.log('Insufficient Details')
//             file.resume();
//             req.unpipe();
//             return next(new errorHandler('Enter All Details',400))
//         }
//         if(!['video/mp4'].includes(mimeType)){
//             console.log('Unsupported File Type')
//             file.resume();
//             req.unpipe();
//             return next(new errorHandler('Upload Mp4 Type',400))
//         }

//         const uploadPromise = new Promise<void>((resolve,next)=>{
//             const cloudinaryVideo = cloudinary.uploader.upload_stream({
//                 resource_type:'video'
//             },async(error,result)=>{
//                 if(error){
//                     return next(new errorHandler('Error While Uploading To Cloudinary',400))
//                 }
//                 if(isAborted){
//                     console.log('Request Aborted')
//                    if(result?.secure_url){
//                     await deleteFromCloudinary(result?.public_id,'video')
//                    }
//                    return next(new errorHandler('Request Aborted',400))
//                 }
    
//                 req.fileInfo!.filePublicId = result?.public_id || " "
//                 req.fileInfo!.fileUrl = result?.secure_url || " "
//                 console.log('Public ID',req.fileInfo!.filePublicId)
//                 resolve()
//             })
    
//             file.pipe(cloudinaryVideo)
//             file.on('error',async(error)=>{
//                 return next(new errorHandler('Error While Upoading File',400))
//             })
//         })

//         uploadPromises.push(uploadPromise)
//     }else if(fieldname == 'thumbnail'){

//         if(!fields.videoId){
//             console.log("Enter Video ID")
//             return next(new errorHandler('Video Id Not Found',400))
//         }
//         if(!['image/png','image/jpg'].includes(mimeType)){
//             console.log('Unsupported File Type')
//             file.resume();
//             req.unpipe();
//             return next(new errorHandler('Upload JPG/PNG Type',400))
//         }

//         const uploadPromise = new Promise<void>((resolve,next)=>{
//             const cloudinaryVideo = cloudinary.uploader.upload_stream({
//                 resource_type:'image'
//             },async(error,result)=>{
//                 if(error){
//                     return next(new errorHandler('Error While Uploading To Cloudinary',400))
//                 }
//                 if(isAborted){
//                     console.log('Request Aborted')
//                    if(result?.secure_url){
//                     await deleteFromCloudinary(result?.public_id,'video')
//                    }
//                    return next(new errorHandler('Request Aborted',400))
//                 }
    
//                 req.fileInfo!.thumbnailId = result?.public_id || " "
//                 req.fileInfo!.thumbnailUrl = result?.secure_url || " "
//                 console.log('Public ID',req.fileInfo!.thumbnailId)
//                 resolve()
//             })
    
//             file.pipe(cloudinaryVideo)
//             file.on('error',async(error)=>{
//                 return next(new errorHandler('Error While Upoading File',400))
//             })
//         })

//         uploadPromises.push(uploadPromise)
//     }
//     })


//     bb.on('finish',async ()=>{
//         try{
//             await Promise.all(uploadPromises)
//         if(isAborted){
//             if(req.fileInfo?.filePublicId){
//                 await deleteFromCloudinary(req.fileInfo.filePublicId,'video')
//             }
//             return next(new errorHandler('Request Aborted',500))
//         }
//         req.fileInfo!.description = fields.description
//         req.fileInfo!.subject = fields.subject
//         req.fileInfo!.title = fields.title


//         if(!fields.title || !fields.description || !fields.subject){
//             try {
//                 if (req.fileInfo?.filePublicId) await deleteFromCloudinary(req.fileInfo?.filePublicId, 'video');
//             } catch (error) {
//                 return next(new errorHandler('Error While Deleting Video', 500));
//             }
//         }

//         console.log(req.fileInfo?.filePublicId)

//         console.log('File Upload Complete')
//         next()
//     }catch(error){
//         next(error)
//     }


//     })

//     req.pipe(bb)
   
// });

// Multer configuration
// const storage = multer.diskStorage({
//     destination: (req, res, callback) => {
//         callback(null, 'uploads/image');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void = (req, file, cb) => {
//     if (!file.mimetype.startsWith('image/')) {
//         return cb(new Error('Please upload an image file'));
//     }
//     cb(null, true);
// };


// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter
// });
// export const singleUpload = upload.single('image');













