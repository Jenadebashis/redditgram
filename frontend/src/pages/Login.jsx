import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/token/', {
        username,
        password,
      });

      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);

      // ✅ Save username for ownership checks
      localStorage.setItem('username', username);
      navigate('/'); // Redirect to home or dashboard after login

      // Redirect or navigate
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
