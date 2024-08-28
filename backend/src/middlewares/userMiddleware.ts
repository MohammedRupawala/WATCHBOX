import { Request,Response,NextFunction } from "express";
import { TryCatch } from "./errorHandler.js";
import { verifyToken } from "../utils/features.js";
import errorHandler from "../utils/utilclass.js";
declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}
const isAuthenticated = TryCatch(async(req:Request,res:Response,next : NextFunction)=>{
    const headers = req.headers["authorization"]
    if(headers && headers.startsWith("Bearer ")) {
        const token = headers.split(" ")[1]
        if(token == null) return next(new errorHandler("No Token Provided",401))
        const  id  =  verifyToken(token)
        if(!id) return next(new errorHandler("User is Not Authorized",401))
        req.id = id
        next()
    }
    else{
        return next(new errorHandler("Authorization Header Missing or Invalid", 401));
    }
})

export default isAuthenticated