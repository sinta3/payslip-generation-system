const { Reimbursement } = require("../../database/models");

const createReimbursement = async (data) => {
  return Reimbursement.create(data);
};

module.exports = {
  createReimbursement,
};
