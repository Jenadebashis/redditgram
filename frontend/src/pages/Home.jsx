import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) navigate('/login');
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <PostList initialUrl="/posts/" />
    </div>
  );
}

export default Home;
