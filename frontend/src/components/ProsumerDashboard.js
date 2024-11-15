// src/components/ProsumerDashboard.js

import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ProsumerDashboard() {
    const location = useLocation();
    const { prosumerData } = location.state || {};
    const [deviceData, setDeviceData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const solintegToken = 'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzE1ODE4NjYsIlVfSUQiOiI2NjYwMGEzOTdmMGI5OTE0ZDEwYzc5ZDciLCJVX05BTUUiOiJzaGFpbGVuZHJhLm5haXJAYXRyaWFwb3dlci5jb20iLCJJU19BRE1JTiI6ZmFsc2UsIkNSRUFURV9USU1FIjoxNzMxNTgxODY2NjY0fQ.5gpbPNgO1RfwLdKLdvL0JVM6-ElTkyx_ru77MgzDB0c'; // Replace with actual Solinteg API token
                const solintegApiUrl = 'https://lb.solinteg-cloud.com/openapi/v2/wrapper/device/queryDeviceRealtimeData';

                const response = await axios.get(solintegApiUrl, {
                    headers: {
                        'Authorization': `Bearer ${solintegToken}`,
                        'Accept': 'application/json',
                        'token': solintegToken,
                    },
                    params: { deviceSn: prosumerData.deviceSerialNumber }
                });

                setDeviceData(response.data.body);
            } catch (err) {
                console.error('Error fetching device data:', err);
                setError('Failed to fetch device data.');
            }
        };

        if (prosumerData?.deviceSerialNumber) {
            fetchDeviceData();
        }
    }, [prosumerData]);

    if (!prosumerData) {
        return <Typography variant="h6" color="error">Prosumer data not found.</Typography>;
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Prosumer Real-Time Data</Typography>
                {deviceData ? (
                    <>
                        <Typography variant="body1">Energy Produced Today: {deviceData.eday} kWh</Typography>
                        <Typography variant="body1">Energy from PV Today: {deviceData.epvDay} kWh</Typography>
                    </>
                ) : (
                    error ? (
                        <Typography variant="body2" color="error">{error}</Typography>
                    ) : (
                        <Typography variant="body2">Loading real-time data...</Typography>
                    )
                )}
            </CardContent>
        </Card>
    );
}

export default ProsumerDashboard;
