import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!image) return alert("Please select an image.");

    try {
      // 1. Upload image to Cloudinary
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'djthedon'); // or your preset name

      const cloudinaryRes = await axios.post(
        'https://api.cloudinary.com/v1_1/dfcjz5pcg/image/upload',
        formData
      );

      const imageUrl = cloudinaryRes.data.secure_url;

      // 2. Send post to Django
      await axios.post(
        'http://localhost:8000/api/posts/',
        {
          caption,
          image_url: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );

      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Post upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <textarea
        className="w-full p-2 border"
        rows="3"
        placeholder="Write your caption..."
        onChange={e => setCaption(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files[0])}
        className="w-full"
      />
      <button className="w-full bg-indigo-600 text-white py-2">Post</button>
    </form>
  );
}

export default CreatePost;
