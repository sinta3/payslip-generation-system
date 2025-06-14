const { Overtime } = require("../../database/models");

const getExistingOvertime = async (employeeId, date) => {
  return Overtime.findOne({
    where: {
      employee_id: employeeId,
      date,
    },
  });
};

const createOvertime = async (data) => {
  return Overtime.create(data);
};

module.exports = {
  getExistingOvertime,
  createOvertime,
};
