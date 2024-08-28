import { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/utilclass.js";
import { controllerType } from "../types/types.js";

export const errorMiddleware = (
    error : errorHandler,
    req:Request,
    res:Response,
    next : NextFunction
)=>{
  error.message =  error.message || "An Unexpected Error Came"
  error.statusCode = error.statusCode||  500;
  if (res.headersSent) {
    return next(error); 
}
  res.status(error.statusCode).json({
    success:false,
    message : error.message
})
} 
export const TryCatch =
  (func: controllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };