let isLogin = true;

const toggleForm = () => {
  isLogin = !isLogin;
  document.getElementById('form-title').textContent = isLogin ? 'Login' : 'Signup';
  document.getElementById('name').style.display = isLogin ? 'none' : 'block';
  document.getElementById('form-btn').textContent = isLogin ? 'Login' : 'Signup';
  document.getElementById('toggle-btn').textContent = isLogin ? 'Switch to Signup' : 'Switch to Login';
  document.getElementById('message').textContent = '';
};

document.getElementById('toggle-btn').addEventListener('click', toggleForm);

document.getElementById('form-btn').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password || (!isLogin && !name)) {
    document.getElementById('message').textContent = 'Please fill in all fields!';
    return;
  }

  const endpoint = isLogin ? 'login' : 'signup';
  const payload = isLogin ? { email, password } : { name, email, password };

  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('message').textContent = isLogin
        ? `Welcome, ${data.name}!`
        : 'Signup successful! Please log in.';
      if (!isLogin) toggleForm();
    } else {
      document.getElementById('message').textContent = data.error || 'An error occurred!';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('message').textContent = 'An error occurred!';
  }
});
