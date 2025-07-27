import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:9000/api/me/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));

      const ws = new WebSocket(`ws://localhost:9000/ws/notifications/?token=${token}`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'like') {
            toast.info(`Your post ${data.post_id} was liked by ${data.by}`);
          } else if (data.type === 'comment') {
            toast.info(`${data.by} commented on your post`);
          }
        } catch (err) {
          console.error('Invalid WS message', err);
        }
      };
      setSocket(ws);
      return () => ws.close();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    if (socket) socket.close();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">RedditGram</Link>
      <div className="space-x-4">
        {token && user ? (
          <>
            <Link to="/feed" className="text-gray-700 hover:text-indigo-600">Feed</Link>
            <Link to="/search" className="text-gray-700 hover:text-indigo-600">Search</Link>
            <Link to="/create" className="text-gray-700 hover:text-indigo-600">New Post</Link>
            <span className="text-gray-700">👤 {user.username}</span>
            <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
            <Link to="/signup" className="text-gray-700 hover:text-indigo-600">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
