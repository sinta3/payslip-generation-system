const { submitReimbursementService } = require("./reimbursement.service");

const submitReimbursement = async (req, res, next) => {
  try {
    const reimbursement = await submitReimbursementService(req);

    res
      .status(200)
      .json({ message: "Submit reimbursement success", reimbursement });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitReimbursement,
};
