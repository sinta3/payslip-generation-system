const {
  submitPayrollPeriodService,
  processPayrollService,
  getEmployeePayslipService,
  getEmployeePayslipSummaryService,
} = require("./payroll.service");

const submitPayrollPeriod = async (req, res, next) => {
  try {
    const payroll = await submitPayrollPeriodService(req);

    res.status(200).json({ message: "Submit payroll period success", payroll });
  } catch (error) {
    next(error);
  }
};

const submitProcessPayroll = async (req, res, next) => {
  try {
    const payslip = await processPayrollService(req, res, next);

    res
      .status(200)
      .json({ message: "Submit process payroll period success", payslip });
  } catch (error) {
    next(error);
  }
};

const getEmployeePayslip = async (req, res, next) => {
  try {
    const payroll = await getEmployeePayslipService(req);

    res.status(200).json({ message: "Get employee payslip success", payroll });
  } catch (error) {
    next(error);
  }
};

const getSummaryEmployeePayroll = async (req, res, next) => {
  try {
    const payroll = await getEmployeePayslipSummaryService(req);

    res.status(200).json({
      message: "Get summary employee payroll period success",
      payroll,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitPayrollPeriod,
  submitProcessPayroll,
  getEmployeePayslip,
  getSummaryEmployeePayroll,
};
