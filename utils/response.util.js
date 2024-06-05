// Create a success response
const successResponse = (message, data = null) => {
    return {
      success: true,
      message: message,
      data: data,
    };
  };
  
  // Create a failure response
  const failResponse = (error) => {
    return {
      success: false,
      error: error,
    };
  };
  
  module.exports = { successResponse, failResponse };
  