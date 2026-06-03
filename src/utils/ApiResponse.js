// ApiResponse is a standard wrapper for ALL successful responses
// Every API response will look the same — predictable for the frontend
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;

    // success is true if status code is less than 400
    this.success = statusCode < 400;

    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;