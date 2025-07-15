const Log = require("./logger");

async function testLogs() {
  await Log("backend", "fatal", "db", "Database connection lost");
}

testLogs();
