document
  .getElementById('loginForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const loginData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
    if (response.ok) {
      alert('Login successful');
      // Optionally, redirect to another page
      // window.location.href = '/dashboard.html';
    } else {
      alert(result.msg || 'Login failed');
    }
  });
