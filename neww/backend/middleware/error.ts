import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";


export const ErrorMiddleWare =  (err:any,req:Request,res:Response,next:NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong mongoDb Id error

    if(err.name == 'CastError'){
        const message = ` Resource not Found. Invalid Resourser ${err.path}`;
        err = new ErrorHandler(message,400);
    }
    
    // Duplicate key Error's

    if(err.code === 1100){
        
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }
    
    // wrong Json web token Error 
    
    if(err.name === 'TokenExpiredError'){
        
        const message = `Please login again | jwt token Expired, try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success : false,
        message : err.message,
        errorStack : err.errorStack
    })
}


export default ErrorMiddleWare;