import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { PostCard } from '../components/PostCard';

const UserPosts = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);

  const fetchUserPosts = (url = `/posts/user/${username}/`) => {
    API.get(url)
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data.results]);
        setNextPage(res.data.next);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load user posts. Please try again later.');
        setLoading(false);
      });
  };

  useEffect(() => {
    setPosts([]);
    setLoading(true);
    fetchUserPosts(); // Initial fetch on username change
  }, [username]);

  const handleLoadMore = () => {
    if (nextPage) {
      fetchUserPosts(nextPage);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">
        Posts by @{username}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && posts.length === 0 && <p className="text-white">Loading...</p>}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {!loading && nextPage && (
        <button
          onClick={handleLoadMore}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Load More
        </button>
      )}

      {!loading && posts.length === 0 && !error && (
        <p className="text-gray-400">No posts found for @{username}.</p>
      )}
    </div>
  );
};

export default UserPosts;
