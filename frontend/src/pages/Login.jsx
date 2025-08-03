import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import API from '../api';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await API.post('/token/', data);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('username', data.username);
      navigate('/');
      toast.success('Logged in successfully');
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full"
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
      <div>
        <a href="/password-reset" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
      </div>
    </form>
  );
};

export default Login;
