import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9000/api/register/', form);
      navigate('/login');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input name="username" onChange={handleChange} placeholder="Username" className="w-full p-2 border" />
      <input name="email" onChange={handleChange} placeholder="Email" className="w-full p-2 border" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full p-2 border" />
      <button className="w-full bg-indigo-600 text-white py-2">Sign Up</button>
    </form>
  );
}

export default Signup;
