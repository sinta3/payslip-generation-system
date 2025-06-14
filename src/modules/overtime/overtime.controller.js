const { submitOvertimeService } = require("./overtime.service");

const submitOvertime = async (req, res, next) => {
  try {
    const overtime = await submitOvertimeService(req);

    res.status(200).json({ message: "Submit overtime success", overtime });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitOvertime,
};
