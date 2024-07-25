// Utility class designed to standardize the structure of responses sent from an API.
class ApiResponse {
    constructor(
        statusCode,
        data,
        message = "Success"
    ) {
        this.statusCode = statusCode        // HTTP status code provided to the constructor.
        this.data = data                    // data provided to the constructor
        this.message = message
        this.success = statusCode < 400     // If status code is less than 400 then success
    }
}

export { ApiResponse }