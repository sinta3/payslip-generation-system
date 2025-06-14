const {
  getExistingAttendance,
  upsertAttendance,
} = require("./attendance.repository");
const { throwCustomError } = require("../../shared/util.handler");

const submitAttendanceService = async (req) => {
  const { attendance_type } = req.body;
  const currentTime = new Date();
  const day = currentTime.getDay();

  const isWeekend = day === 6 || day === 0;
  if (isWeekend) {
    throwCustomError("Today is weekend, failed to submit attendance!", 400);
  }

  const currentDate = currentTime.toISOString().split("T")[0];
  const employeeId = req.employee.employee_id;
  const existingAttendance = await getExistingAttendance(
    employeeId,
    currentDate,
  );
  if (existingAttendance) {
    throwCustomError("Employee already submit attendance today!", 400);
  }

  const savedData = {
    employee_id: employeeId,
    date: currentDate,
    request_id: req.audit_log.request_id,
    created_by: employeeId,
    updated_by: employeeId,
  };

  if (attendance_type === "checkin") {
    savedData.checkin_at = currentTime;
  } else if (attendance_type === "checkout") {
    savedData.checkout_at = currentTime;
  } else {
    throwCustomError("Attendance type not valid!", 400);
  }

  const attendance = await upsertAttendance(savedData);
  return attendance;
};

module.exports = {
  submitAttendanceService,
};
