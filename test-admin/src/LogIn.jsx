import { Login, useLogin } from 'react-admin';
import sandersImage from './image/sanders.jpg'; 
import { Box, TextField, Button } from '@mui/material';
import React from 'react';

const MyLoginForm = () => {
    const login = useLogin();

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        login({
            username: formData.get('username'),
            password: formData.get('password'),
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                width: '100%',
                maxWidth: '400px',
                padding: 2,
                backgroundColor: '#1b1b1b',
                borderRadius: '8px',
    
            }}
        >
            <TextField
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                    style: { color: '#ffffff' }, // El color de la etiqueta
                }}
                InputProps={{
                    style: { color: '#ffffff' }, // El color del texto
                }}
                sx={{
                    input: {
                        textAlign: 'center',
                    },
                    '& fieldset': {
                        borderColor: '#ffffff', // El color del borde
                    },
                }}
            />
            <TextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                    style: { color: '#ffffff' }, // El color de la etiqueta
                }}
                InputProps={{
                    style: { color: '#ffffff' }, // El color del texto
                }}
                sx={{
                    input: {
                        textAlign: 'center',
                    },
                    '& fieldset': {
                        borderColor: '#ffffff', // El color del borde
                    },
                }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Sign In
            </Button>
        </Box>
    );
};

export const MyLoginPage = () => (
    <Login
        backgroundImage={sandersImage}
        sx={{
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            backgroundColor: '#192559',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <MyLoginForm />
    </Login>
);
