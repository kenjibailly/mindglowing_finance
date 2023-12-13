// Check token expiry on page load or at regular intervals
function checkTokenExpiry() {
    const token = getCookie('token'); // Replace with your cookie retrieval logic
  
    if (token) {
      const decodedToken = parseJwt(token);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      // Check if the token is about to expire (e.g., within the next 5 minutes)
      if (expirationTime - currentTime < 5 * 60 * 1000) {
        renewToken();
      }
    }
  }
  
  // Request to renew the token
  function renewToken() {
    console.log('renewing-token');
    // Make a POST request to your server's /renew-token endpoint
    // Include the refresh token stored in your cookies in the request
    fetch('/auth/renew-token', {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Update the token cookie with the new token value
          setCookie('token', data.token); // Replace with your cookie setting logic
        } else {
          console.error('Token renewal failed:', data.message);
        }
      })
      .catch(error => {
        console.error('Token renewal error:', error);
      });
  }
  
  // Helper function to get cookies by name
  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }
  
  // Helper function to set cookies
  function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`;
  }
  
  // Helper function to parse JWT (JSON Web Token)
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
  
    return JSON.parse(jsonPayload);
  }
  
// Check token expiry on page load and set up an interval to check periodically
function setupTokenExpiryCheck() {
    // Check token expiry immediately on page load
    checkTokenExpiry();
  
    // Set up an interval to check token expiry every 5 minutes (adjust as needed)
    setInterval(checkTokenExpiry, 5 * 60 * 1000);
  }
  
// Call setupTokenExpiryCheck on page load
setupTokenExpiryCheck();