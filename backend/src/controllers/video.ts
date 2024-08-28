import { NextFunction, Request,Response } from "express";
import fs from "fs"
import path from 'path'
import { TryCatch } from "../middlewares/errorHandler.js";
import { baseQuery, newVideoType, searchQuery, updateVideoType } from "../types/types.js";
import errorHandler from "../utils/utilclass.js";
import Video from "../models/videoModel.js";
import { fileCleanup, isAbortedFunction } from "../middlewares/cleanUp.js";
import User from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";

declare module 'express-serve-static-core' {
    interface Request {
        fileInfo?: {


            fileUrl ?: string;
            filePublicId ?:string
            title ?:string,
            subject?:string,
            description?:string,
            thumbanailUrl?: string,
            thumbnailId?: string

        };
    }
}

type SortOrder = 1 | -1;

type SortOptions  = {
    [key: string]: SortOrder;
};



export  const getVideo = TryCatch(async(req : Request,res : Response,next : NextFunction)=>{
  try { const videoId = req.params.id
    const videoInfo = await Video.findById(videoId)
    if(!videoInfo) return next(new errorHandler('Video Not Found',400))
    const videoPath = videoInfo?.video
    const fullPath = path.resolve(videoPath!)
    if (!fs.existsSync(fullPath)) {
        return res.status(404).send('Video not found');
    }
    const stat = fs.statSync(fullPath)
    const fileSize = stat.size


    const range = req.headers.range
    if(range){
        const parts = range.replace(/bytes=/,"").split("-")
        const start = parseInt(parts[0],10)
        const end = parts[1]?parseInt(parts[1],10) : fileSize-1;
        const chunkSize = (end - start) + 1

        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);


        const videoStream = fs.createReadStream(fullPath, { start, end });
        videoStream.pipe(res);

    }
    else {
        // // If no Range header is present, send the entire file
        // const head = {
        //     'Content-Length': fileSize,
        //     'Content-Type': 'video/mp4',
        // };
        // res.writeHead(200, head);
        // fs.createReadStream(fullPath).pipe(res);

        next(new errorHandler("Required Range Headers",400))
    }
}
catch(error){
    next(error)
}
})
export  const getAllVideo = TryCatch(async(req : Request,res : Response,next : NextFunction)=>{
try{
    const video = await Video.find({})
   // if(!video) return next(new errorHandler('No Video Found',400))
    res.status(200).json({
        success:true,
        video
    })
}catch(error){
    next(error)
}
})

export const getAllSubject = TryCatch(async(req : Request,res : Response,next : NextFunction)=>{
    let  subjects
    try{
        subjects  = await Video.distinct('subject')
        res.status(200).json({
            success : true,
            subjects
        })
    }catch(error){
        next(new errorHandler('Error While Fetching  Subjects',400))
    }
})
export const getSearchResult = TryCatch(async(req : Request<{},{},searchQuery>,res : Response,next : NextFunction)=>{
    try{
    const {search,sort,type,subject} = req.query
  
    const BaseQuery: baseQuery = {}

    const searchType = type || 'Video';

    // Handle pagination
    const page = Number(req.query.page) || 1; // Current page number (default is 1)
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8; // Items per page (default is 8)
    const skip = limit * (page - 1); // Calculate the number of documents to skip

    // Initialize the base query for Users and Videos
    const userQuery: baseQuery = {};
    const videoQuery: baseQuery = {};

    if (search) {
        if (searchType === 'User' || searchType === 'Both') {
           if(typeof search === 'string'){
            userQuery.name = {
                $regex: new RegExp(search, 'i')
            };
           }
        }
        if (searchType === 'Video' || searchType === 'Both') {
            if(typeof search === 'string'){
                userQuery.name = {
                    $regex: new RegExp(search, 'i')
                };
               }
        }
    }

    if (searchType === 'Video' && subject) {
        if(typeof subject === 'string')
        {videoQuery.subject = subject;}
    }

    let sortOptions : SortOptions = { createdAt: -1 }; // Default sort field is 'createdAt' in descending order

    if (typeof sort === 'string') {
        const [sortField, sortDirection] = sort.split(':');
        const direction = sortDirection === 'asc' ? 1 : -1;
        sortOptions = { [sortField || 'createdAt']: direction };
    }


    // Count documents in both collections
    const totalUsers = searchType === 'User' || searchType === 'Both' ? await User.countDocuments(userQuery) : 0;
    let totalVideos = searchType === 'Video' || searchType === 'Both' ? await Video.countDocuments(videoQuery) : 0;

    // Calculate pages for each type
    const userPages = searchType === 'User' || searchType === 'Both' ? Math.ceil(totalUsers / limit) : 0;
    let videoPages = searchType === 'Video' || searchType === 'Both' ? Math.ceil(totalVideos / limit) : 0;

    // Fetch results from both collections
    const userResults = (searchType === 'User' || searchType === 'Both')
        ? await User.find(userQuery).sort(sortOptions!).skip(skip).limit(limit)
        : [];

    const videoResults = (searchType === 'Video' || searchType === 'Both')
        ? await Video.find(videoQuery).sort(sortOptions!).skip(skip).limit(limit)
        : [];

    // If no query parameters are provided, return all videos
    if (!search && !type) {
        videoResults.push(...await Video.find().sort(sortOptions).skip(skip).limit(limit));
        videoPages = Math.ceil(await Video.countDocuments() / limit);
    }

    // Send the results back to the client
    res.json({
        users: {
            results: userResults,
            page,
            pages: userPages,
            totalResults: totalUsers
        },
        videos: {
            results: videoResults,
            page,
            pages: videoPages,
            totalResults: totalVideos
        }
    });
}catch(error){
    next(new errorHandler('Error While Fetching',400))
}
})

export  const getUserVideo = TryCatch(async(req : Request,res : Response,next : NextFunction)=>{
    try{
        const id = req.id
        const userVideo = await Video.find({user : id})
        res.status(200).json({
            success : true,
            userVideo
        })
    }
    catch(error){
        next(new errorHandler("Error While Fetching Videos",400))
    }
})
export const uploadVideo = [
    TryCatch(async(req : Request<{},{},newVideoType>,res : Response,next : NextFunction)=>{
    const subject = req.fileInfo?.subject
    const title = req.fileInfo?.title
    const description = req.fileInfo?.description
    const thumbnail = req.fileInfo?.thumbanailUrl
    const id = req.id
    const  video = req.fileInfo?.fileUrl
    let isAborted = false;
    req.on('aborted', async() => {
        isAborted = true;
        console.log('in last aborted',isAborted)
        console.log('Request Aborted');

        // Handle cleanup if needed
        if (req.fileInfo && req.fileInfo.filePublicId) {
            console.log('Deleting file due to request abortion');
            cloudinary.uploader.destroy(req.fileInfo.filePublicId, { resource_type: 'video' }, (error, result) => {
                if (error) {
                    console.error('Error deleting video on abort:', error);
                } else {
                    console.log('Video deleted successfully on abort:', result);
                }
            });
        }
    });
    if(!title || !subject || !video || !description ){
        return next(new errorHandler("Enter All Fields",400))
    }

   try{ 
    const defaultThumbNail = "https://res.cloudinary.com/dqy6ffx6k/image/upload/v1724767116/images_pcz0p0.jpg"
    const upload = await Video.create({
        title,
        description,
        video ,
        user : id,
        subject,
        likes : 0,
        thumbnail : defaultThumbNail
    })

    return res.status(201).json({
        success : true,
        message : "Video Uploaded Successfully"
   })
}catch(error){
    next (error)
}


})]
export const updateVideo = TryCatch(async(req : Request<{id:string},{},updateVideoType>,res : Response,next : NextFunction)=>{
    const userId = req.id
    const {title,description,subject} = req.body
    const  {id} = req.params



   try{
     const videoInfo = await Video.findById(id)
    if(!videoInfo) return next(new errorHandler("Video Not Found",400))
    if(videoInfo?.user != userId) return next(new errorHandler("Not Authorized To Update Video",401))
    if(title) videoInfo.title = title
    if(subject) videoInfo.subject = subject
    if(description) videoInfo.description = description
    await videoInfo.save()


    return res.status(200).json({
        success: true,
        message: 'Video updated successfully',
        videoInfo
    });
}catch(error){
    next(error)
}

    
})
export const deleteVideo = TryCatch(async(req : Request,res : Response,next : NextFunction)=>{
    const {id} = req.params
    const userId = req.id
    try{
        const videoInfo = await Video.findById(id)
        if(!videoInfo) return next(new errorHandler("Video Not Found",400))
        if(videoInfo?.user != userId) return next(new errorHandler("Not Authorized To  Delete Video",401))
        const videoPath = videoInfo.video;
        const fullPath = path.resolve(videoPath!);
        console.log(videoPath)
        try {
            await cloudinary.uploader.destroy(fullPath, { resource_type: 'video' });
            console.log('Video deleted successfully');
        } catch (error) {
            console.error('Error deleting video after finish:', error);
        }
        await Video.deleteOne({_id:id})
        res.status(200).json({
            success:true,
            message:"Video Deleted Successfully"
        })
    }catch(error){
      next(error)
    }
})