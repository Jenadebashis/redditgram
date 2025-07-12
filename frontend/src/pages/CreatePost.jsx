import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim()) return alert("Caption cannot be empty.");

    try {
      await axios.post(
        'http://localhost:9000/api/posts/',
        { caption },
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
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
        Post
      </button>
    </form>
  );
}

export default CreatePost;
