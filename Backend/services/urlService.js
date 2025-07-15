const { v4: uuidv4 } = require("uuid");
const geoip = require("geoip-lite");
const Log = require("../../LoggingMiddware/logger");
const { urlDatabase, clickStats } = require("../utils/database");

async function createUrl(req, res) {
  const { url, validity = 30, shortcode } = req.body;
  if (!url || !url.startsWith("http")) {
    await Log("backend", "error", "handler", "Invalid URL format");
    return res.status(400).json({ message: "Invalid URL format" });
  }
  const code = shortcode || uuidv4().slice(0, 6);
  if (urlDatabase[code]) {
    await Log("backend", "warn", "handler", "Shortcode already in use");
    return res.status(409).json({ message: "Shortcode taken" });
  }
  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);
  urlDatabase[code] = { originalURL: url, createdAt: now, expiry };
  clickStats[code] = [];
  await Log("backend", "info", "controller", `Shortened URL created: ${code}`);
  return res.status(201).json({
    shortLink: `http://localhost:3001/${code}`,
    expiry: expiry.toISOString(),
  });
}

async function redirectUrl(req, res) {
  const code = req.params.shortcode;
  const record = urlDatabase[code];
  if (!record) {
    await Log("backend", "error", "handler", "Shortcode not found");
    return res.status(404).json({ message: "Shortcode not found" });
  }
  if (Date.now() > record.expiry.getTime()) {
    await Log("backend", "warn", "handler", "Link expired");
    return res.status(410).json({ message: "Expired" });
  }
  const geo = geoip.lookup(req.ip) || { country: "Unknown" };
  clickStats[code].push({
    timestamp: new Date(),
    referrer: req.get("Referrer") || "Direct",
    location: geo.country,
  });
  await Log("backend", "info", "controller", `Redirecting: ${code}`);
  res.redirect(record.originalURL);
}

async function fetchStats(req, res) {
  const code = req.params.shortcode;
  const record = urlDatabase[code];
  if (!record) {
    await Log("backend", "error", "handler", "Stats failed, shortcode missing");
    return res.status(404).json({ message: "Not found" });
  }
  const clicks = clickStats[code];
  await Log("backend", "info", "controller", `Stats retrieved for ${code}`);
  res.json({
    originalURL: record.originalURL,
    createdAt: record.createdAt,
    expiry: record.expiry,
    clicks: clicks.length,
    clickData: clicks,
  });
}

module.exports = {
  createUrl,
  redirectUrl,
  fetchStats,
};
