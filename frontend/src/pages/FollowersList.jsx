import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import API from '../api';

const FollowersList = () => {
  const { username } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/users/${username}/followers/`)
      .then(res => {
        setUsers(res.data.followers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Followers of @{username}</h2>
      {users.length === 0 && <p>No followers found.</p>}
      {users.map(u => (
        <div key={u} className="border-b py-2">
          <Link
              to={`/user/${u}`}
              className="text-sm text-blue-600 hover:underline"
            >
              @{u}
            </Link>
        </div>
      ))}
    </div>
  );
};

export default FollowersList;
