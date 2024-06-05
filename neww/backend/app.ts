import express, { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";

import colors from "colors";
colors.enable();

import cookieParser from 'cookie-parser'

import cors from 'cors'
import ErrorMiddleWare from "./middleware/error";
import userRoute from "./routes/user.route";

const app = express();

dotenv.config({path : "./config/config.env"})


app.use(express.json({limit : "50mb"}));


app.use(cookieParser());


app.use(cors({
    origin : process.env.ORIGIN
}));



app.get('/test', (req:Request,res:Response,next:NextFunction) => {

    res.status(200).send('<h1>This is route Route</h1>');

});


app.use("/api/v1/user",userRoute)



app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success : false,
        message : `This route is not available ${req.url}`
    })
});



app.use(ErrorMiddleWare);


export default app;