import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';
import { PostCard } from '../components/PostCard';
import EditBio from '../components/UpdateBio';

const UserPosts = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const loggedInUsername = localStorage.getItem('username'); // or decode JWT token if needed
  const isOwner = loggedInUsername === username;

  console.log(`Fetching posts for user: ${username} and bio: ${bio} and isOwner: ${isOwner} and loggedInUsername: ${loggedInUsername}`);


  const fetchUserPosts = (url = `/posts/user/${username}/`) => {
    API.get(url)
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data.results.posts]);
        setBio(res.data.results.bio); // ✅ Extract bio
        setNextPage(res.data.next);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load user posts. Please try again later.");
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
    <div className="flex justify-center px-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/3 bg-white p-5 rounded-xl shadow"
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={`/profile_images/${((username.charCodeAt(0) % 5) + 1)}.webp`}
              alt={username}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
            />
            <h2 className="mt-3 text-xl font-bold text-indigo-600">@{username}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {bio || "This user hasn’t written a bio yet."}
            </p>
            {isOwner && (
              <>
                {!editingBio && (
                  <button
                    onClick={() => setEditingBio(true)}
                    className="mt-2 text-sm text-indigo-500 hover:underline"
                  >
                    Edit Bio
                  </button>
                )}

                {editingBio && (
                  <EditBio
                    initialBio={bio}
                    onUpdate={(newBio) => {
                      setBio(newBio);
                      setEditingBio(false);
                    }}
                  />
                )}
              </>
            )}
            <p className="mt-3 text-sm text-gray-700">
              Total Posts: <span className="font-semibold">{posts.length}</span>
            </p>
          </div>
        </motion.div>


        {/* Main Content */}
        <div className="w-full md:w-2/3 mt-4">
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
      </div>
    </div>
  );

};

export default UserPosts;
