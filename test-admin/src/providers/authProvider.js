import CryptoJS from 'crypto-js';

export const authProvider = {
    login: async ({ username, password }) => {
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      console.log("Entered auth provider login to check inhabilited login")
        try {
          const response = await fetch('https://localhost:3000/login', {
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

          if(!data.acceso){
              console.log("NO LOGIN POSSIBLE THANKS TO EXCESS")

              alert(data.message);
            
          }
      
          if (data.acceso) {

            // Store token in localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('nivel_acceso', data.nivel_acceso);
            localStorage.setItem('token', data.token); // Store the token
            console.log('Token almacenado:', data.token);
          }
        } catch (error) {
          console.error('Login error:', error);
        }
      },      

  logout: () => {
      localStorage.removeItem("username");
      localStorage.removeItem('nivel_acceso');
      localStorage.removeItem('token'); // Remove the token on logout
      return Promise.resolve();
  },

  checkError: ({ status }) => {
      if (status === 401 || status === 403) {
          localStorage.removeItem("username");
          localStorage.removeItem('token'); // Remove token on auth error
          return Promise.reject();
      }
      return Promise.resolve();
  },

  checkAuth: () => {
      return localStorage.getItem("username") && localStorage.getItem("token")
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





