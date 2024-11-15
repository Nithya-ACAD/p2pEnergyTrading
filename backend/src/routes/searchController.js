const express = require('express');
const router = express.Router();
const axios = require('axios');
const { db } = require('../config/firebaseConfig'); // Ensure you have Firestore configured


// Define the base URL for Solinteg API
const SOLINTEG_BASE_URL = 'https://lb.solinteg-cloud.com/openapi/v2/wrapper/device/queryDeviceRealtimeData';

// Define the authorization token (ensure this is kept secure)
const SOLINTEG_TOKEN = process.env.SOLINTEG_TOKEN; // Replace with your actual token

// Function to fetch real-time data from Solinteg API for a specific device
const fetchDeviceData = async (deviceSn) => {
    try {
        const response = await axios.get(SOLINTEG_BASE_URL, {
            headers: {
                Authorization: `Bearer ${SOLINTEG_TOKEN}`,
                Accept: 'application/json',
                token: SOLINTEG_TOKEN,
            },
            params: {
                deviceSn: deviceSn,
            },
        });

        // Check if the response was successful and return the required data
        if (response.data.successful) {
            return response.data.body; // Contains `eday` and `epvDay`
        } else {
            throw new Error('Failed to fetch device data');
        }
    } catch (error) {
        console.error('Error fetching device data from Solinteg API:', error);
        return null;
    }
};

router.post('/search', async (req, res) => {
    const { energyUnits } = req.body;

    try {
        // Step 1: Fetch all prosumers from Firestore
        const prosumerSnapshot = await db.collection('prosumers').get();
        const prosumers = prosumerSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Step 2: Retrieve real-time data for each prosumer's device
        const matchingProsumers = [];
        for (const prosumer of prosumers) {
            const deviceData = await fetchDeviceData(prosumer.deviceSerialNumber);

            // Step 3: Check if the prosumer meets the required energy units
            if (deviceData && deviceData.epvDay >= energyUnits) {
                matchingProsumers.push({
                    id: prosumer.id,
                    name: prosumer.name,
                    address: prosumer.address,
                    availableEnergy: deviceData.epvDay,
                });
            }
        }

        // Step 4: Send the matching prosumers as a response
        res.json({ prosumers: matchingProsumers });
    } catch (error) {
        console.error('Error fetching prosumer data:', error);
        res.status(500).json({ error: 'Failed to fetch matching prosumers' });
    }
});

module.exports = router;
