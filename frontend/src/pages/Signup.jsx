import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/register/`, data);
      toast.success('Signup successful');
      navigate('/login');
    } catch (err) {
      toast.error('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-10 space-y-4">
      <div>
        <input
          {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Min 3 characters' } })}
          placeholder="Username"
          className="w-full p-2 border"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>
      <div>
        <input
          {...register('email', { required: 'Email is required' })}
          placeholder="Email"
          className="w-full p-2 border"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <input
          type="password"
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
          placeholder="Password"
          className="w-full p-2 border"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      <button className="w-full bg-indigo-600 text-white py-2">Sign Up</button>
    </form>
  );
}

export default Signup;
