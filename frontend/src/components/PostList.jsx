import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access');

  const fetchPosts = (url = '/posts/') => {
    API.get(url)
      .then(res => {
        setPosts(prev => [...prev, ...res.data.results]);
        setNextPage(res.data.next);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts(); // fetch initial page
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-blue-600 text-lg font-semibold">
        ⏳ Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600 text-lg">
        ❌ {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        📭 No posts yet. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="p-4">

      {isLoggedIn && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/create')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            ➕ Create Post
          </button>
        </div>
      )}

      {posts.map(post => (
        <div
          key={post.id}
          className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Username */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
              {post.author_username?.charAt(0).toUpperCase()}
            </div>
            <p className="font-medium text-indigo-700">@{post.author_username}</p>
          </div>

          {/* Post caption */}
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
            {post.caption}
          </p>

          {/* Timestamp */}
          <p className="text-xs text-gray-400 text-right mt-3">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}

      {nextPage && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mx-auto block"
          onClick={() => fetchPosts(nextPage)}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default PostList;


