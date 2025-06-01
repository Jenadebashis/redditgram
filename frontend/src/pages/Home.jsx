import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) navigate('/login');
  }, []);

  return <h1 className="text-2xl font-semibold">Welcome to RedditGram 👋</h1>;
}

export default Home;
