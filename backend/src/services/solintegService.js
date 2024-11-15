const axios = require("axios");

const authUrl = "https://lb.solinteg-cloud.com/openapi/v2/loginv2/auth";
const deviceListUrl = "https://lb.solinteg-cloud.com/openapi/v2/topic/getLinkedDevices";

async function getAuthToken() {
  try {
    const response = await axios.post(authUrl, {
      authAccount: process.env.SOLINTEG_ACCOUNT,
      authPassword: process.env.SOLINTEG_PASSWORD,
    });
    return response.data.body;
  } catch (error) {
    console.error("Error getting Solinteg auth token:", error);
    throw error;
  }
}

async function getDeviceList(token) {
  try {
    const response = await axios.get(deviceListUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        token: token,
      },
    });
    return response.data.body;
  } catch (error) {
    console.error("Error fetching device list:", error);
    throw error;
  }
}

module.exports = { getAuthToken, getDeviceList };
