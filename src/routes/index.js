const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const modulesPath = path.join(__dirname, "../modules");

fs.readdirSync(modulesPath).forEach((moduleName) => {
  const routePath = path.join(
    modulesPath,
    moduleName,
    `${moduleName}.routes.js`,
  );

  if (fs.existsSync(routePath)) {
    const moduleRouter = require(routePath);
    router.use(`/${moduleName}`, moduleRouter);
  }
});

module.exports = router;
