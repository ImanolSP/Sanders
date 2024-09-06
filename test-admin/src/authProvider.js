
import CryptoJS from 'crypto-js';

export const authProv = {
    login: async ({ username, password }) => {
        // Hash the password using SHA-256
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: username,
                    contraseña: hashedPassword,
                }),
                credentials: 'include', // This ensures cookies are sent with the request
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            if (data.acceso) {
                localStorage.setItem('username', username);
                console.log("nivel_acceso:",data.nivel_acceso);
                localStorage.setItem('nivel_acceso',data.nivel_acceso);
                // You no longer need to store the token in localStorage

                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    },

    logout: () => {
        localStorage.removeItem("username");
        localStorage.removeItem('nivel_acceso');
        localStorage.removeItem("password"); // Remove the hashed password as well
        return Promise.resolve();
    },

    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("username");
            localStorage.removeItem("password"); // Remove the hashed password as well
            return Promise.reject();
        }
        return Promise.resolve();
    },

    checkAuth: () => {
        return localStorage.getItem("username")
            ? Promise.resolve()
            : Promise.reject();
    },

    getPermissions: () => Promise.resolve(),
};
