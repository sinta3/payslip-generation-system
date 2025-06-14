const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/environment.config");
const { throwCustomError } = require("../shared/util.handler");

const validateTokenEmployee = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    throwCustomError("Missing or invalid Authorization header", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "employee") {
      throwCustomError("Forbidden to access this resource", 401);
    }

    req.employee = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

const validateTokenAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    throwCustomError("Missing or invalid Authorization header", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      throwCustomError("Forbidden to access this resource", 401);
    }

    req.employee = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateTokenEmployee,
  validateTokenAdmin,
};
