const { createReimbursement } = require("./reimbursement.repository");

const submitReimbursementService = async (req) => {
  const { total_reimbursement, description } = req.body;
  const currentTime = new Date();
  const currentDate = currentTime.toISOString().split("T")[0];
  const employeeId = req.employee.employee_id;

  const savedData = {
    employee_id: employeeId,
    date: currentDate,
    request_id: req.audit_log.request_id,
    total_reimbursement,
    description,
    created_by: employeeId,
    updated_by: employeeId,
  };

  const reimbursement = await createReimbursement(savedData);
  return reimbursement;
};

module.exports = {
  submitReimbursementService,
};
