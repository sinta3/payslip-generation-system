const express = require("express");
const routes = require("./routes");
const logger = require("./shared/logger");
const errorHandler = require("./middleware/error-handler");
const { PORT } = require("./config/environment.config");
const { sequelize } = require("./database/models/index");

const portApp = PORT || 3000;
const app = express();
let server;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/healthcheck", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.use(errorHandler);

sequelize
  .authenticate()
  .then(() => {
    logger.info("DB connected");

    return sequelize.sync({ alter: false });
  })
  .then(() => {
    logger.info("Database synced");

    server = app.listen(portApp, () => {
      logger.info(`Server running on port ${portApp}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to connect or sync DB", err);
    process.exit(1);
  });

const startGracefulShutdown = () => {
  logger.warn("Starting graceful shutdown");
  logger.warn("closing");

  server.close((error) => {
    if (error) {
      console.error("critical error", error);
      return process.exit(1);
    }

    logger.warn("exiting");
    process.exit(0);
  });
};

process.on("SIGINT", startGracefulShutdown);
process.on("SIGTERM", startGracefulShutdown);
process.on("SIGHUP", startGracefulShutdown);

module.exports = app;
