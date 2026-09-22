export function errorHandler(err, req, res, next) {
  console.error("API Error:", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    error: err.message,
  });

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message:
      statusCode >= 500
        ? "An unexpected error occurred."
        : err.message || "Request failed.",
    errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
    requestId: req.requestId,
  };

  res.status(statusCode).json(response);
}
