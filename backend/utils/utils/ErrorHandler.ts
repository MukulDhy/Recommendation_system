class ErrorHandler extends Error {
    statusCode : Number;
    errorStack:any;
    constructor(message:any,statusCode:Number){
        super(message);
        this.statusCode = statusCode;
        this.errorStack = this.stack;

        Error.captureStackTrace(this,this.constructor)
    }
}

export default ErrorHandler