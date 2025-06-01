import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8000/api/me/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">RedditGram</Link>
      <div className="space-x-4">
        {token && user ? (
          <>
            <span className="text-gray-700">👤 {user.username}</span>
            <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
            <Link to="/signup" className="text-gray-700 hover:text-indigo-600">Sign Up</Link>
            <Link to="/create" className="text-gray-700 hover:text-indigo-600">New Post</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
