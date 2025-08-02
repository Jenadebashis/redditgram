import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL, WS_BASE_URL } from '../config';

function Navbar({ onToggleLeft, onToggleRight }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE_URL}/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));

      const ws = new WebSocket(`${WS_BASE_URL}/ws/notifications/?token=${token}`);
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
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleLeft}
          className="lg:hidden text-gray-700"
          aria-label="Toggle left sidebar"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <Link to="/" className="text-xl font-bold text-indigo-600">RedditGram</Link>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleRight}
          className="lg:hidden text-gray-700"
          aria-label="Toggle right sidebar"
        >
          <BellIcon className="w-6 h-6" />
        </button>
        {token && user ? (
          <>
            <Link to="/feed" className="text-gray-700 hover:text-indigo-600">Feed</Link>
            <Link to="/search" className="text-gray-700 hover:text-indigo-600">Search</Link>
            <Link to="/create" className="text-gray-700 hover:text-indigo-600">New Post</Link>
            <Link to="/create-story" className="text-gray-700 hover:text-indigo-600">New Story</Link>
            {user.avatar && (
              <Link to={`/user/${user.username}`}><img src={user.avatar} alt={user.username} className="inline w-8 h-8 rounded-full" /></Link>
            )}
            <Link to={`/user/${user.username}`}>{user.username}</Link>
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
