const { submitAttendanceService } = require("./attendance.service");

const submitAttendance = async (req, res, next) => {
  try {
    const attendance = await submitAttendanceService(req);

    res.status(200).json({ message: "Submit attendance success", attendance });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAttendance,
};
