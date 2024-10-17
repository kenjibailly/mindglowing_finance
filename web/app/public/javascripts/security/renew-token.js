// Request to renew the token
function renewToken() {
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
      } else {
        console.error('Token renewal failed:', data.message);
      }
    })
    .catch(error => {
      console.error('Token renewal error:', error);
    });
}

const loginPage = document.querySelector('.login-wrapper');
if(!loginPage) {
  setInterval(() => {
    renewToken();
  }, 1000 * access_token_expiry - (access_token_expiry / 10));
  renewToken();
}