const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  JWT_SECRET,
  JWT_EXPIRATION_TIME,
} = require("../../config/environment.config");
const { getEmployeeByUsername } = require("./employee.repository");
const { throwCustomError } = require("../../shared/util.handler");

const generateJwtToken = (username, role, employeeId) => {
  const token = jwt.sign(
    { username, role, employee_id: employeeId },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRATION_TIME,
    },
  );
  return token;
};

const loginService = async (req) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throwCustomError("Username and password required");
  }

  const employeeDetail = await getEmployeeByUsername(username);
  if (!employeeDetail) {
    throwCustomError("Employee not found", 400);
  }

  const passwordMatch = await bcrypt.compare(password, employeeDetail.password);
  if (!passwordMatch) {
    throwCustomError("Invalid username or password", 400);
  }

  const accessToken = generateJwtToken(
    username,
    employeeDetail.role,
    employeeDetail.employee_id,
  );
  const loginData = {
    accessToken,
    employeeId: employeeDetail.employee_id,
    fullName: employeeDetail.full_name,
    username: employeeDetail.username,
    role: employeeDetail.role,
  };
  return loginData;
};

module.exports = {
  loginService,
};
