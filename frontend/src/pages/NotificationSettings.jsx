import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import API from '../api';

const NotificationSettings = () => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    API.get('/notification-preferences/').then((res) => reset(res.data));
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      await API.put('/notification-preferences/', data);
      toast.success('Preferences saved');
    } catch (err) {
      toast.error('Failed to save preferences');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
      <label className="flex items-center">
        <input type="checkbox" {...register('notify_on_like')} className="mr-2" />
        Notify on likes
      </label>
      <label className="flex items-center">
        <input type="checkbox" {...register('notify_on_comment')} className="mr-2" />
        Notify on comments
      </label>
      <label className="flex items-center">
        <input type="checkbox" {...register('notify_on_follow')} className="mr-2" />
        Notify on follows
      </label>
      <label className="flex items-center">
        <input type="checkbox" {...register('email_digest')} className="mr-2" />
        Receive email digests
      </label>
      <button type="submit" className="bg-indigo-600 text-white px-4 py-1 rounded">Save</button>
    </form>
  );
};

export default NotificationSettings;
