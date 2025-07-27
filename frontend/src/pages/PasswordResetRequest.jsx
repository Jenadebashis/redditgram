import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:9000/api/password-reset/', { email });
      if (res.data.reset_link) {
        setMessage(`Reset link: ${res.data.reset_link}`);
      } else {
        setMessage('If an account exists for that email, a reset link has been sent.');
      }
    } catch (err) {
      setMessage('Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
        Send Reset Link
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default PasswordResetRequest;
