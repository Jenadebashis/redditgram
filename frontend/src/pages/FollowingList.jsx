import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const FollowingList = () => {
  const { username } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/users/${username}/following/`)
      .then(res => {
        setUsers(res.data.following);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">@{username} is following</h2>
      {users.length === 0 && <p>Not following anyone.</p>}
      {users.map(u => (
        <div key={u} className="border-b py-2">@{u}</div>
      ))}
    </div>
  );
};

export default FollowingList;
