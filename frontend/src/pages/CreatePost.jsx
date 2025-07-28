import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function CreatePost() {
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim()) return alert("Caption cannot be empty.");

    try {
      await axios.post(
        `${API_BASE_URL}/posts/`,
        { caption, tag_names: tags.split(',').map(t => t.trim()).filter(Boolean) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );

      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Post creation failed');
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="w-full p-2 border rounded mt-2"
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
        Post
      </button>
    </form>
  );
}

export default CreatePost;
