import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import API from '../api';
import { PostCard } from '../components/PostCard';

const PostDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    API.get(`/posts/${id}/`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load post.');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (data) {
      reset({ caption: data.caption });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
      const res = await API.patch(`/posts/${id}/`, { caption: formData.caption });
      setData(res.data);
      toast.success('Post updated');
      setEditing(false);
    } catch (err) {
      toast.error('Failed to update post');
    }
  };

  const canEdit = data && data.author_username === localStorage.getItem('username');

  if (loading) {
    return <div className="text-center mt-20 text-blue-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {data && <PostCard post={data} />}
      {canEdit && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="bg-indigo-600 text-white px-4 py-1 rounded"
        >
          Edit
        </button>
      )}
      {editing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <textarea
            {...register('caption', { required: 'Caption is required' })}
            className="w-full border p-2"
          />
          {errors.caption && (
            <p className="text-red-500 text-sm">{errors.caption.message}</p>
          )}
          <div className="space-x-2">
            <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
            <button type="button" className="bg-gray-300 px-3 py-1 rounded" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostDetail;
