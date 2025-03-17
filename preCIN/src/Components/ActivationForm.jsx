import React, { useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import Axios from 'axios';

const ActivationForm = () => {
    const [key, setKey] = useState('');
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await Axios.post('http://localhost:3000/api/activate', { key });
            setMessage({ type: 'success', text: res.data.message });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data.message || 'Erreur' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {message && <Alert severity={message.type}>{message.text}</Alert>}
            <TextField 
                label="Clé d'activation" 
                value={key} 
                onChange={(e) => setKey(e.target.value)} 
                fullWidth 
                required
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Activer
            </Button>
        </form>
    );
};

export default ActivationForm;
