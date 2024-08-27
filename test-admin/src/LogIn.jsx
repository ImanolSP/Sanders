import { Login } from 'react-admin';
import sandersImage from './image/sanders.jpg'; 
import { Box } from '@mui/material';
import React from 'react';

export const MyLoginPage = () => (

    <Login
        backgroundImage={sandersImage}
        sx={{
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            backgroundColor: '#192559',
             
        }}
        
    />
);