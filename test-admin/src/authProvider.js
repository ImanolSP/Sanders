import CryptoJS from 'crypto-js';

export const authProvider = {
    login: async ({ username, password }) => {
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
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            if (data.acceso) {
                localStorage.setItem('username', username);
                localStorage.setItem('nivel_acceso', data.nivel_acceso);

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
        return Promise.resolve();
    },

    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("username");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    checkAuth: () => {
        return localStorage.getItem("username")
            ? Promise.resolve()
            : Promise.reject();
    },

    getPermissions: () => {
        const nivel_acceso = localStorage.getItem('nivel_acceso');
        if (nivel_acceso === '1') {
            return Promise.resolve('admin');
        } else if (nivel_acceso === '2') {
            return Promise.resolve('executive');
        } else {
            return Promise.resolve('restricted');
        }
    }
};


