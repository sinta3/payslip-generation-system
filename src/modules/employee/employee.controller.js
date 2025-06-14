const { loginService } = require("./employee.service");

const login = async (req, res, next) => {
  try {
    const loginData = await loginService(req);

    res.status(200).json({ message: "Login success", loginData });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
