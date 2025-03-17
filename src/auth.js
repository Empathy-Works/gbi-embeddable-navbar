export function checkAuth() {
  fetch('https://app.thegbi.org/resources/accounts/me/', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  })
    .then(response => response.json())
    .then(userData => {
      if (userData.email) {
        document.querySelector('.logged-in-actions').style.display = 'flex';
        document.querySelector('.logged-out-actions').style.display = 'none';
      } else {
        document.querySelector('.logged-in-actions').style.display = 'none';
        document.querySelector('.logged-out-actions').style.display = 'flex';
      }
    })
    .catch(error => console.log('Authentication request failed', error));
}