const { throwCustomError } = require("../../shared/util.handler");
const {
  getExistingOvertime,
  createOvertime,
} = require("./overtime.repository");

const submitOvertimeService = async (req) => {
  const { date, overtime_hours } = req.body;

  const currentTime = new Date();
  const currentDate = currentTime.toISOString().split("T")[0];

  const isInvlidOvertimeDate = date >= currentDate;
  if (isInvlidOvertimeDate) {
    const message =
      "Overtime date must be in the past. You cannot submit overtime for today or a future date.";
    throwCustomError(message, 400);
  }

  const isMoreThanAllowedTime = overtime_hours > 3;
  if (isMoreThanAllowedTime) {
    const message = "Overtime only allowed for maximal 3 hours";
    throwCustomError(message, 400);
  }

  const employeeId = req.employee.employee_id;
  const existingOvertime = await getExistingOvertime(employeeId, date);
  if (existingOvertime) {
    const message = `Overtime for date ${date} already exists`;
    throwCustomError(message, 400);
  }

  const savedData = {
    employee_id: employeeId,
    date,
    request_id: req.audit_log.request_id,
    overtime_hours,
    created_by: employeeId,
    updated_by: employeeId,
  };

  const overtime = await createOvertime(savedData);
  return overtime;
};

module.exports = {
  submitOvertimeService,
};
