// specialized error handling class designed for use in API contexts by extending the built-in Error class
// and adding several properties such as statusCode, data, success, and errors to provide more detailed information about the error.

class ApiError extends Error{       // class ApiError that extends the built-in Error class.
    constructor(
        statusCode,                             // HTTP status code associated with the error.
        message = "Something went wrong",
        errors = [],                            // array to hold multiple error details
        stack = ""                              //  stack trace for debugging purposes.
    ) {
        super(message)
        
        this.statusCode = statusCode        //Stores the HTTP status code.
        this.data = null                    // used to store additional data related to the error.
        this.message = message
        this.success = false                // False because operation was not successful
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            // This method ensures that the stack trace starts from the point where the ApiError was instantiated, rather than where the Error class was instantiated.
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {ApiError}