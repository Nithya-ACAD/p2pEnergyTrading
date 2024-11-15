// src/components/ConsumerDashboard.js

import React, { useState } from 'react';
import { Typography, TextField, Button, Container, Card, CardContent } from '@mui/material';
import axios from 'axios';

function ConsumerDashboard() {
    const [energyUnits, setEnergyUnits] = useState('');
    const [error, setError] = useState('');
    const [prosumerList, setProsumerList] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const handleRequestEnergy = async () => {
        if (parseFloat(energyUnits) <= 0) {
            setError('Please enter a valid number of energy units.');
            setSuccessMessage('');
            return;
        }

        try {
            // Call the Beckn `/search` API with energy units as the request parameter
            const response = await axios.post('http://localhost:3030/search', {
                energyUnits: parseFloat(energyUnits)
            });

            // Assuming the response structure has the matched prosumers in `data.prosumers`
            const matchedProsumers = response.data.prosumers || [];
            setProsumerList(matchedProsumers);
            setSuccessMessage(`Found ${matchedProsumers.length} prosumers matching your request.`);
            setError('');
        } catch (error) {
            console.error('Error searching for prosumers:', error);
            setError('Failed to find matching prosumers. Please try again.');
            setProsumerList([]);
        }
    };

    const handleSelectProsumer = (prosumer) => {
        // Future functionality: handle the selection of a specific prosumer
        alert(`Selected prosumer: ${prosumer.name} with device SN ${prosumer.deviceSerialNumber}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Consumer Dashboard</Typography>
            <Typography variant="body1" gutterBottom>
                Enter the number of energy units you need:
            </Typography>
            <TextField
                label="Energy Units"
                type="number"
                value={energyUnits}
                onChange={(e) => setEnergyUnits(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleRequestEnergy}>
                Request Energy
            </Button>
            {error && <Typography color="error" gutterBottom>{error}</Typography>}
            {successMessage && <Typography color="primary" gutterBottom>{successMessage}</Typography>}

            {/* Display matched prosumers */}
            <div style={{ marginTop: '20px' }}>
                {prosumerList.map((prosumer, index) => (
                    <Card key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                            <Typography variant="h6">Prosumer: {prosumer.name}</Typography>
                            <Typography>Device Serial Number: {prosumer.deviceSerialNumber}</Typography>
                            <Typography>Available Energy: {prosumer.availableEnergy} units</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleSelectProsumer(prosumer)}
                            >
                                Select
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Container>
    );
}

export default ConsumerDashboard;
