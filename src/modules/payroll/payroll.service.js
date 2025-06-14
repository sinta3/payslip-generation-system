const {
  PAYROLL_CUTOFF_HOUR,
  PAYROLL_CUTOFF_DAY_OFFSET,
} = require("../../config/environment.config");
const {
  geExistingPayrollPeriod,
  createPayrollPeriod,
  updatePayrollPeriod,
  bulkInsertEmployeePayroll,
  getAttendanceByPeriod,
  getOvertimeByPeriod,
  getReimbursementByPeriod,
  updateAttendanceById,
  updateOvertimeById,
  updateReimbursementById,
  getEmployees,
  getEmployeePayroll,
  getEmployeesPayroll,
} = require("./payroll.repository");
const { throwCustomError } = require("../../shared/util.handler");
const { sequelize } = require("../../database/models");

const submitPayrollPeriodService = async (req) => {
  const { payroll_period_month, payroll_period_year, start_date, end_date } =
    req.body;

  const endDateFormatted = new Date(end_date);
  const cutoff = new Date(endDateFormatted);
  cutoff.setDate(cutoff.getDate() + Number(PAYROLL_CUTOFF_DAY_OFFSET));
  cutoff.setHours(Number(PAYROLL_CUTOFF_HOUR), 0, 0, 0);

  const existingPayroll = await geExistingPayrollPeriod(
    payroll_period_month,
    payroll_period_year,
  );
  if (existingPayroll) {
    const message =
      "Payroll already exists, failed to submit new period payroll";
    throwCustomError(message, 400);
  }

  const savedData = {
    payroll_period_month,
    payroll_period_year,
    start_date,
    end_date,
    cutoff_at: cutoff,
    created_by: req.employee.employee_id,
    request_id: req.audit_log.request_id,
  };
  const payroll = await createPayrollPeriod(savedData);
  return payroll;
};

const processPayrollService = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { payroll_period_month, payroll_period_year } = req.body;

    const payrollPeriod = await geExistingPayrollPeriod(
      payroll_period_month,
      payroll_period_year,
    );
    if (!payrollPeriod) {
      throwCustomError("Payroll not found", 400);
    }

    if (payrollPeriod.is_locked) {
      throwCustomError("Payroll already processed for this period.", 400);
    }

    const { cutoff_at, start_date, end_date, payroll_id } = payrollPeriod;

    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];
    if (currentDate <= new Date(end_date)) {
      throwCustomError("Cannot process payroll before the end date.", 400);
    }

    if (today <= cutoff_at) {
      throwCustomError("Cannot process payroll before cutoff start.", 400);
    }

    const employeeId = req.employee.employee_id;
    await updatePayrollPeriod(payroll_id, employeeId, transaction);

    const [attendances, overtimes, reimbursements, employees] =
      await Promise.all([
        getAttendanceByPeriod(start_date, end_date),
        getOvertimeByPeriod(start_date, end_date),
        getReimbursementByPeriod(start_date, end_date),
        getEmployees(),
      ]);

    const employeePayrolls = [];
    const daysInPeriod = Math.ceil(
      (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24) + 1,
    );

    for await (const emp of employees) {
      const salary = emp.salary;
      const periodAttendances = attendances.filter(
        (a) => a.employee_id === emp.employee_id,
      );
      const periodOvertimes = overtimes.filter(
        (o) => o.employee_id === emp.employee_id,
      );
      const periodReimbursement = reimbursements.filter(
        (r) => r.employee_id === emp.employee_id,
      );

      const workHourDaily = 8;
      const countHourlyPeriod = daysInPeriod * workHourDaily;
      const hourlyRate = Math.round(salary / countHourlyPeriod);

      const attendanceDays = periodAttendances.length;
      const totalRegularSalary = attendanceDays * workHourDaily * hourlyRate;

      const overtimeHours = periodOvertimes.reduce(
        (sum, o) => sum + o.overtime_hours,
        0,
      );
      const totalOvertimeSalary = overtimeHours * hourlyRate * 2;

      const totalReimbursement = periodReimbursement.reduce(
        (sum, r) => sum + r.total_reimbursement,
        0,
      );
      const totalTakeHome =
        totalRegularSalary + totalOvertimeSalary + totalReimbursement;

      employeePayrolls.push({
        payroll_id: payroll_id,
        employee_id: emp.employee_id,
        total_salary: totalTakeHome,
        total_overtime_salary: totalOvertimeSalary,
        total_reimbursement_salary: totalReimbursement,
        total_reguler_salary: totalRegularSalary,
        hourly_salary: hourlyRate,
        total_attendance_day: attendanceDays,
        total_overtime_hours: overtimeHours,
        total_reimbursement_request: periodReimbursement.length,
        request_id: req.audit_log.request_id,
        created_by: employeeId,
        is_locked: true,
      });
    }

    await bulkInsertEmployeePayroll(employeePayrolls);
    const attendanceIds = attendances.map(
      (attendance) => attendance.attendance_id,
    );
    const overtimeIds = overtimes.map((overtime) => overtime.overtime_id);
    const reimbursementIds = reimbursements.map(
      (reimbursement) => reimbursement.reimbursement_id,
    );
    await Promise.all([
      updateAttendanceById(attendanceIds, employeeId, transaction),
      updateOvertimeById(overtimeIds, employeeId, transaction),
      updateReimbursementById(reimbursementIds, employeeId, transaction),
    ]);

    await transaction.commit();
    return employeePayrolls;
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const getEmployeePayslipService = async (req) => {
  const { payroll_period_month, payroll_period_year } = req.query;

  const payrollPeriod = await geExistingPayrollPeriod(
    payroll_period_month,
    payroll_period_year,
  );
  if (!payrollPeriod?.is_locked) {
    throwCustomError("Payroll not found or not yet processed", 400);
  }

  const employeeId = req.employee.employee_id;
  const payrollId = payrollPeriod.payroll_id;
  const employeePayroll = await getEmployeePayroll(employeeId, payrollId);
  if (!employeePayroll) {
    throwCustomError("Employee payroll not found or not yet processed", 400);
  }

  const formattedPayslip = {
    payroll_id: payrollId,
    employee_id: employeePayroll.employee_id,
    total_salary: employeePayroll.total_salary,
    total_overtime_salary: employeePayroll.total_overtime_salary,
    total_reimbursement_salary: employeePayroll.total_reimbursement_salary,
    total_reguler_salary: employeePayroll.total_reguler_salary,
    hourly_salary: employeePayroll.hourly_salary,
    total_attendance_day: employeePayroll.total_attendance_day,
    total_overtime_hours: employeePayroll.total_overtime_hours,
    total_reimbursement_request: employeePayroll.total_reimbursement_request,
  };

  return formattedPayslip;
};

const getEmployeePayslipSummaryService = async (req) => {
  const { payroll_period_month, payroll_period_year } = req.query;

  const payrollPeriod = await geExistingPayrollPeriod(
    payroll_period_month,
    payroll_period_year,
  );
  if (!payrollPeriod?.is_locked) {
    throwCustomError("Payroll not found or not yet processed", 400);
  }

  const payrollId = payrollPeriod.payroll_id;
  const employeesPayroll = await getEmployeesPayroll(payrollId);
  if (!employeesPayroll) {
    throwCustomError("Employee payroll not found or not yet processed", 400);
  }

  let totalSalaryAllEmployee = 0;
  const employeePayslip = [];

  for (const employeePayroll of employeesPayroll) {
    const formattedData = {
      employee_id: employeePayroll.employee_id,
      total_salary: employeePayroll.total_salary,
    };

    employeePayslip.push(formattedData);
    totalSalaryAllEmployee =
      Number(totalSalaryAllEmployee) + Number(employeePayroll.total_salary);
  }

  const formattedSummary = {
    total_salary_employees: totalSalaryAllEmployee,
    employee_salary: employeePayslip,
  };

  return formattedSummary;
};

module.exports = {
  submitPayrollPeriodService,
  processPayrollService,
  getEmployeePayslipService,
  getEmployeePayslipSummaryService,
};
