const { Employee } = require("../../database/models");

const getEmployeeByUsername = async (username) => {
  return Employee.findOne({ where: { username } });
};

module.exports = {
  getEmployeeByUsername,
};
