// src/components/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button, Typography, Container } from '@mui/material';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rrNumber, setRrNumber] = useState('');
    const [role, setRole] = useState('consumer'); // Fixed role as "consumer"
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save the user data to Firestore
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                email,
                rrNumber,
                role,
            });

            navigate('/login'); // Redirect to login page after registration
        } catch (err) {
            console.error('Error during registration:', err);
            setError('Failed to register. Please try again.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Register</Typography>
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="RR Number"
                value={rrNumber}
                onChange={(e) => setRrNumber(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleRegister}>
                Register
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Container>
    );
}

export default Register;
