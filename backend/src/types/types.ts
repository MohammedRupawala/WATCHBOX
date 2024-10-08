import { Request,Response,NextFunction } from "express";
export type controllerType =  ( 
    req: Request<any>,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type newUserType  = {
    _id : string,
    photo : string,
    name : string,
    email : string,
    password : string,
}

export type userSignInType = {
    email : string,
    password : string
}

// export type newVideoType  = {
//     title : string,
//     description : string,
//     likes : number,
//     user : string,
//     video : string,
//     subject : string
//     thumbnail : string
// }
export interface CustomRequest extends Request {
    files?: {
        [fieldname: string]: Express.Multer.File[]; // Ensure you use the correct type for files
    };
    fileInfo?: {
        filePublicId?: string;
        fileUrl?: string;
        thumbnailId?: string;
        thumbnailUrl?: string;
        subject : string,
        title : string,
        description : string
    };
}

export  type updateVideoType = {
    title : string,
    description : string,
    subject : string
}


export type searchQuery = {
    search ?: string,
    sort  ?: string,
    type ?: string
    subject ?: string 
    page ?: string
}


export type baseQuery = {
    title?: {
        $regex: RegExp;
    };
    name?: {
        $regex: RegExp;
    };
    subject?: string;
}


export type fileUploadType = {
    thumbnailUrl ?: string,
    thumbnailId ?: string,
    videoUrl ?: string,
    videoId ?: string,
    title ?: string,
    description ?: string,
    subject ?: string
}


export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    // Add other properties if needed
  }