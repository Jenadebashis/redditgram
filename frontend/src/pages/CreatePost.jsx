import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

function CreatePost() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [tags, setTags] = useState('');
  const [userProfession, setUserProfession] = useState('');
  const [profession, setProfession] = useState('');
  const [feeling, setFeeling] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    axios
      .get(`${API_BASE_URL}/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserProfession(res.data.profession || '');
        setProfession(res.data.profession || '');
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${API_BASE_URL}/posts/`,
        {
          caption: data.caption,
          profession,
          feeling,
          tag_names: tags.split(',').map(t => t.trim()).filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      toast.success('Post created');
      reset();
      setTags('');
      navigate('/');
    } catch (err) {
      toast.error('Post creation failed');
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <textarea
          {...register('caption', { required: 'Caption cannot be empty' })}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded"
        />
        {errors.caption && <p className="text-red-500 text-sm">{errors.caption.message}</p>}
      </div>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="w-full p-2 border rounded mt-2"
      />
      {userProfession && (
        <select
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        >
          <option value="">Global</option>
          <option value={userProfession}>{userProfession}</option>
        </select>
      )}
      <select
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
        className="w-full p-2 border rounded mt-2"
      >
        <option value="">No Feeling</option>
        <option value="happy">Happy</option>
        <option value="sad">Sad</option>
        <option value="angry">Angry</option>
        <option value="fear">Fear</option>
        <option value="surprise">Surprise</option>
        <option value="disgust">Disgust</option>
        <option value="trust">Trust</option>
        <option value="anticipation">Anticipation</option>
      </select>
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
        Post
      </button>
    </form>
  );
}

export default CreatePost;
