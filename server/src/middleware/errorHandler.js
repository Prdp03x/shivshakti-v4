export function errorHandler(err, req, res, next) {
  console.error("API error:", err.status || 500, err.message);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    error: err.status ? err.message : "An unexpected server error occurred.",
  });
}
