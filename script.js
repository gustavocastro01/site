document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    if (!email || !password) {
      document.getElementById('message').textContent = 'Please fill in all fields!';
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        document.getElementById('message').textContent = `Welcome, ${data.name}!`;
      } else {
        document.getElementById('message').textContent = data.error || 'Login failed!';
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('message').textContent = 'An error occurred!';
    }
  });
  