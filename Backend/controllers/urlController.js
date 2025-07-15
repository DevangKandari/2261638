const {
  createUrl,
  redirectUrl,
  fetchStats,
} = require("../services/urlService");

const createShortUrl = (req, res) => createUrl(req, res);
const redirectShortUrl = (req, res) => redirectUrl(req, res);
const getStats = (req, res) => fetchStats(req, res);

module.exports = {
  createShortUrl,
  redirectShortUrl,
  getStats,
};
