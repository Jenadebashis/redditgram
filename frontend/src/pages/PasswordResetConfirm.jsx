import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PasswordResetConfirm = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');
    try {
      await axios.post('http://localhost:9000/api/password-reset-confirm/', {
        uid,
        token,
        password,
      });
      setMessage('Password reset successful. You can now log in.');
    } catch (err) {
      setMessage('Invalid or expired link.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        placeholder="New Password"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
        Reset Password
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default PasswordResetConfirm;
