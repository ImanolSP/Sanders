import React from 'react';
import { useLocale, Button } from 'react-admin';

export const LanguageSwitcher = () => {
    const [locale, setLocale] = useLocale(); // Destructure both locale and setter function

    return (
        <div style={{ padding: '1rem' }}>
            <Button onClick={() => setLocale('en')} label="English" />
            <Button onClick={() => setLocale('es')} label="Español" />
        </div>
    );
};
