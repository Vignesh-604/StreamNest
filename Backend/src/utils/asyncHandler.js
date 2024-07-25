//

export const asyncHandler = (requestHandler) => (req, res, next) => {   // passing a function as parameter
    Promise                                     // Either resolve or reject (Catch)
    .resolve(requestHandler(req, res, next))    // Send req, res to middleware for further processing
    .catch((err) => next(err))                  // Send Error to error handling middleware
}


// const asyncHandler = (requestHandler) => async (req, res, next) => {      //nested function or Higher order function
//     try {
//        await requestHandler(res, req, next) 

//     } catch (error) {
//         res.status(err.code || 500).json({      // Error code and json response
//             success: false,                     // For frontend to check success or not
//             message: error.message              // Error msg to display
//         })
//     }
// }