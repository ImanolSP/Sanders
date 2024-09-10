import React from 'react';
import { Button } from '@mui/material';
import { usePermissions } from 'react-admin';

const RestrictedActionButton = () => {
    const { permissions } = usePermissions();  

    return (
        <div>
            {permissions === 'admin' ? (   
                <Button variant="contained" color="primary">
                    Acción Restringida para Admin
                </Button>
            ) : (
                <p>No tienes permisos para realizar esta acción.</p>
            )}
        </div>
    );
};

export default RestrictedActionButton;
