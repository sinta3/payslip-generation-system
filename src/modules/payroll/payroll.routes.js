const express = require("express");
const router = express.Router();
const {
  validateTokenAdmin,
  validateTokenEmployee,
} = require("../../middleware/token-validation-handler");
const { auditLogMiddleware } = require("../../middleware/audit-log-handler");
const {
  submitPayrollPeriod,
  submitProcessPayroll,
  getEmployeePayslip,
  getSummaryEmployeePayroll,
} = require("./payroll.controller");

router.post("/", validateTokenAdmin, auditLogMiddleware, submitPayrollPeriod);
router.post(
  "/process",
  validateTokenAdmin,
  auditLogMiddleware,
  submitProcessPayroll,
);
router.get(
  "/payslip/employee",
  validateTokenEmployee,
  auditLogMiddleware,
  getEmployeePayslip,
);
router.get(
  "/payslip/summary",
  validateTokenAdmin,
  auditLogMiddleware,
  getSummaryEmployeePayroll,
);

module.exports = router;
