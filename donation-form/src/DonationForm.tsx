import React, { useState } from 'react';
import axios from 'axios';
import './DonationForm.css'; // Importa los estilos

const DonationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        amount: '',
        firstName: '',
        lastName: '',
        email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://tu-api.com/donations', formData);
            console.log('Donación enviada:', response.data);
        } catch (error) {
            console.error('Error al enviar la donación:', error);
        }
    };

    return (
        <div className="donation-form-container">
            <h1>Fundación Sanders</h1>
            <h2>Donaciones</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="amount">Valor de donación:</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">Nombre:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Apellido:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Correo:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Donar</button>
            </form>
        </div>
    );
};

export default DonationForm;
