const { Attendance } = require("../../database/models");
const { Op } = require("sequelize");

const getExistingAttendance = async (employeeId, date) => {
  return Attendance.findOne({
    where: {
      employee_id: employeeId,
      date,
      checkin_at: { [Op.ne]: null },
      checkout_at: { [Op.ne]: null },
    },
  });
};

const upsertAttendance = async (data) => {
  return Attendance.upsert(data);
};

module.exports = {
  getExistingAttendance,
  upsertAttendance,
};
