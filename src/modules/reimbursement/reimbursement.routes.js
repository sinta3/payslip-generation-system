const express = require("express");
const router = express.Router();
const {
  validateTokenEmployee,
} = require("../../middleware/token-validation-handler");
const { auditLogMiddleware } = require("../../middleware/audit-log-handler");
const { submitReimbursement } = require("./reimbursement.controller");

router.post(
  "/",
  validateTokenEmployee,
  auditLogMiddleware,
  submitReimbursement,
);

module.exports = router;
