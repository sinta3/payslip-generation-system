const { Op } = require("sequelize");
const {
  Payroll,
  EmployeePayroll,
  Attendance,
  Employee,
  Reimbursement,
  Overtime,
} = require("../../database/models");

const geExistingPayrollPeriod = async (month, year) => {
  return Payroll.findOne({
    where: { payroll_period_month: month, payroll_period_year: year },
  });
};

const createPayrollPeriod = async (data) => {
  return Payroll.create(data);
};

const updatePayrollPeriod = async (payrollId, employeeId, transaction) => {
  return Payroll.update(
    {
      is_locked: true,
      processed_at: new Date(),
      updated_at: new Date(),
      updated_by: employeeId,
    },
    {
      where: { payroll_id: payrollId },
      transaction,
    },
  );
};

const getAttendanceByPeriod = async (startDate, endDate) => {
  return Attendance.findAll({
    where: {
      date: { [Op.between]: [startDate, endDate] },
      is_locked: false,
    },
  });
};

const getOvertimeByPeriod = async (startDate, endDate) => {
  return Overtime.findAll({
    where: {
      date: { [Op.between]: [startDate, endDate] },
      is_locked: false,
    },
  });
};

const getReimbursementByPeriod = async (startDate, endDate) => {
  return Reimbursement.findAll({
    where: {
      date: { [Op.between]: [startDate, endDate] },
      is_locked: false,
    },
  });
};

const bulkInsertEmployeePayroll = async (data, transaction) => {
  return EmployeePayroll.bulkCreate(data, { transaction });
};

const updateAttendanceById = async (attendanceIds, employeeId, transaction) => {
  if (!attendanceIds.length) {
    return;
  }

  return Attendance.update(
    {
      is_locked: true,
      updated_at: new Date(),
      updated_by: employeeId,
    },
    {
      where: {
        attendance_id: { [Op.in]: attendanceIds },
        is_locked: false,
      },
      transaction,
    },
  );
};

const updateOvertimeById = async (overtimeIds, employeeId, transaction) => {
  if (!overtimeIds.length) {
    return;
  }

  return Overtime.update(
    {
      is_locked: true,
      updated_at: new Date(),
      updated_by: employeeId,
    },
    {
      where: {
        overtime_id: { [Op.in]: overtimeIds },
        is_locked: false,
      },
      transaction,
    },
  );
};

const updateReimbursementById = async (
  reimbursementId,
  employeeId,
  transaction,
) => {
  if (!reimbursementId.length) {
    return;
  }

  return Reimbursement.update(
    {
      is_locked: true,
      updated_at: new Date(),
      updated_by: employeeId,
    },
    {
      where: {
        reimbursement_id: { [Op.in]: reimbursementId },
        is_locked: false,
      },
      transaction,
    },
  );
};

const getEmployees = async () => {
  return Employee.findAll({ where: { role: "employee" } });
};

const getEmployeePayroll = async (employeeId, payrollId) => {
  return EmployeePayroll.findOne({
    where: {
      employee_id: employeeId,
      payroll_id: payrollId,
      is_locked: true,
    },
  });
};

const getEmployeesPayroll = async (payrollId) => {
  return EmployeePayroll.findAll({
    where: {
      payroll_id: payrollId,
      is_locked: true,
    },
  });
};

module.exports = {
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
};
