const axios = require("axios");
require("dotenv").config();

const stacks = ["backend", "frontend"];
const levels = ["debug", "info", "warn", "error", "fatal"];
const commonPackages = ["auth", "config", "middleware", "utils"];
const backendPackages = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
];
const frontendPackages = ["api", "component", "hook", "page", "state", "style"];

function getAllowedPackages(stack) {
  if (stack === "backend") return [...backendPackages, ...commonPackages];
  if (stack === "frontend") return [...frontendPackages, ...commonPackages];
  return [];
}

async function Log(stack, level, logPackage, message) {
  if (!stacks.includes(stack)) {
    console.log(`Invalid stack: '${stack}'`);
    return;
  }

  if (!levels.includes(level)) {
    console.log(`Invalid level: '${level}'`);
    return;
  }

  const validPackages = getAllowedPackages(stack);
  if (!validPackages.includes(logPackage)) {
    console.log(`Invalid package '${logPackage}' for stack '${stack}'.`);
    return;
  }

  const apiURL = "http://20.244.56.144/evaluation-service/logs";

  try {
    const response = await axios.post(
      apiURL,
      {
        stack,
        level,
        package: logPackage,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Log sent");
    console.log("logID:", response.data.logID);
    console.log("message:", response.data.message);
  } catch (err) {
    console.error("❌ Error sending log:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

module.exports = Log;
