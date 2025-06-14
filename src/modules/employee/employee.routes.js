const express = require("express");
const router = express.Router();
const { auditLogMiddleware } = require("../../middleware/audit-log-handler");
const { login } = require("./employee.controller");

router.post("/login", auditLogMiddleware, login);

module.exports = router;
