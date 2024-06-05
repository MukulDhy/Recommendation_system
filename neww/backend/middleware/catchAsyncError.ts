import { NextFunction, Request, Response } from "express";

export const CatchAsyncError = (recivedFunction:any) => (req:Request, res:Response,next:NextFunction) => {
    Promise.resolve(recivedFunction(req,res,next)).catch(next)
}









