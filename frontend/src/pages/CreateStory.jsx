import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function CreateStory() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    if (expiresAt) formData.append('expires_at', expiresAt);
    try {
      await API.post('/stories/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/feed');
    } catch (err) {
      console.error(err);
      alert('Failed to create story');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-6 space-y-3">
      <input
        aria-label="file"
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full"
      />
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption"
        className="w-full p-2 border rounded"
      />
      <input
        type="datetime-local"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
        Create Story
      </button>
    </form>
  );
}

export default CreateStory;
