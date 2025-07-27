import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:9000/api/password-reset/', { email });
      if (res.data.reset_link) {
        window.location.href = res.data.reset_link;
      } else {
        toast.error('There was no account associated with this email. please give a valid email.');
      }
    } catch (err) {
      toast.error(`Something went wrong. ${err}`);
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
