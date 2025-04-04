class AppError {
    constructor(message,statusCode){
        this.statusCode = statusCode;
        this.message = message;
    }
}

export default AppError;
  
  