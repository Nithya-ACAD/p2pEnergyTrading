// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { TextField, Button, Typography, Container } from '@mui/material';

function Login() {
    const [rrNumber, setRrNumber] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('rrNumber', '==', rrNumber));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                if (userData.role === 'consumer') {
                    navigate('/consumer-dashboard', { state: { userData } });
                } else if (userData.role === 'prosumer') {
                    navigate('/prosumer-dashboard', { state: { userData } });
                }
            } else {
                setError('Invalid RR Number. Please try again.');
            }
        } catch (err) {
            console.error('Error logging in:', err);
            setError('Failed to log in. Please try again.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Login</Typography>
            <TextField
                label="RR Number"
                value={rrNumber}
                onChange={(e) => setRrNumber(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Container>
    );
}

export default Login;
