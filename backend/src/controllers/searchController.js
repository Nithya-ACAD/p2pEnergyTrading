const { getAuthToken, getDeviceList } = require("../services/solintegService");

async function searchProsumers(req, res) {
  try {
    const { energyUnits } = req.query; // Assume consumer requests energy units as a query param
    const token = await getAuthToken();
    const devices = await getDeviceList(token);

    const matchedProsumers = devices.filter(device => device.eday >= energyUnits);
    res.json(matchedProsumers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prosumer data." });
  }
}

module.exports = { searchProsumers };
