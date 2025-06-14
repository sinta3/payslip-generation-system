const logger = require("../shared/logger");

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const errorResponse = {
    message: err.message || "Internal Server Error",
  };
  const isServerError = status >= 500;

  logger.error(`Error: ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    statusCode: status,
    response: errorResponse,
    auditLog: req.audit_log,
    ...(isServerError && { stack: err.stack }),
  });

  res.status(status).json({
    message: err.message,
  });
};

module.exports = errorHandler;
