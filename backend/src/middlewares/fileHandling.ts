import { NextFunction, Response,Request } from "express";
import { TryCatch } from "./errorHandler.js";
import multer, { FileFilterCallback } from "multer";
import path from 'path'
import { CustomRequest } from "../types/types.js";

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.mimetype.startsWith('video/')) {
            callback(null, 'uploads/video');
        } else if (file.mimetype.startsWith('image/')) {
            callback(null, 'uploads/image');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter: (req: CustomRequest, file: Express.Multer.File, cb: FileFilterCallback) => void = (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Please upload a valid file type'));
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
export const uploadFiles = upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);