const { v4: uuidv4 } = require("uuid");
const requestIp = require("request-ip");
const logger = require("../shared/logger");
const { AuditLog } = require("../database/models");

const auditLogMiddleware = async (req, res, next) => {
  try {
    const requestId = uuidv4();
    const ipAddress = requestIp.getClientIp(req);

    req.audit_log = {
      request_id: requestId,
      ip_address: ipAddress,
    };

    const createdBy = req?.employee?.employee_id || null;

    await AuditLog.create({
      request_id: requestId,
      ip_address: ipAddress,
      created_by: createdBy,
    });

    logger.info(
      `${req.method} ${req.originalUrl} - ${requestId} - ${ipAddress}`,
    );

    next();
  } catch (err) {
    logger.error("Failed to insert audit log", err);
    next();
  }
};

module.exports = {
  auditLogMiddleware,
};
