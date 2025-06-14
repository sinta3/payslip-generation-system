const express = require("express");
const router = express.Router();
const {
  validateTokenEmployee,
} = require("../../middleware/token-validation-handler");
const { auditLogMiddleware } = require("../../middleware/audit-log-handler");
const { submitOvertime } = require("./overtime.controller");

router.post("/", validateTokenEmployee, auditLogMiddleware, submitOvertime);

module.exports = router;
