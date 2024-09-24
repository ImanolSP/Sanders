export const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {

      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      const currentTime = Date.now() / 1000;
  
      if (decodedToken.exp < currentTime) {
        // Token is expired, sign out user
        console.log('Token expired');
        signOutUser();
      }
    }
  };
  
  export const signOutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Username") // Clear localStorage
    window.location.href = '/login'; // Redirect to login page
  };