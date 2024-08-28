import { Request,Response,NextFunction } from "express";
import fs from 'fs'

declare global {
    namespace Express {
        interface Request {
            isAborted?: () => boolean;
        }
    }
}
export const isAbortedFunction = (req: Request, res: Response, next: NextFunction)=>{
    let isAborted = false;
    req.on('aborted', () => {
        isAborted = true;
    });

    // Attach `isAborted` flag to the request object
    req.isAborted = () => isAborted;

    next();
}
export const fileCleanup = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    req.on('close', () => {
        if (file && file.path) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error("Failed to delete temp file:", err);
                }
            });
        }
    });

    next();
};