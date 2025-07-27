import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
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
  const [avatar, setAvatar] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [following, setFollowing] = useState(false);
  const loggedInUsername = localStorage.getItem('username'); // or decode JWT token if needed
  const isOwner = loggedInUsername === username;

  const updatedBio = useSelector(state => state.user.bio); // Assuming you have a Redux store setup
  useEffect(() => {
    if (updatedBio) {
      setBio(updatedBio);
      setEditingBio(false); // Close edit mode after bio update
    }
  }, [updatedBio]);

  console.log(`Fetching posts for user: ${username} and bio: ${bio} and isOwner: ${isOwner} and loggedInUsername: ${loggedInUsername}`);


  const fetchUserPosts = (url = `/posts/user/${username}/`) => {
    API.get(url)
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data.results.posts]);
        setBio(res.data.results.bio);
        setAvatar(res.data.results.avatar);
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
    API.get(`/follow/${username}/`).then(res => setFollowing(res.data.following)).catch(() => setFollowing(false));
    fetchUserPosts(); // Initial fetch on username change
  }, [username]);

  const handleLoadMore = () => {
    if (nextPage) {
      fetchUserPosts(nextPage);
    }
  };

  const toggleFollow = async () => {
    try {
      const res = await API.post(`/follow/${username}/`);
      setFollowing(res.data.following);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      setUploadMsg('Uploading...');
      const res = await API.put('/profile/avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatar(res.data.avatar_url);
      setUploadMsg('');
      toast.success('Avatar updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update avatar. Please try again.');
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
              src={avatar || `/profile_images/${((username.charCodeAt(0) % 5) + 1)}.webp`}
              alt={username}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
            />
            <h2 className="mt-3 text-xl font-bold text-indigo-600">@{username}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {bio || "This user hasn’t written a bio yet."}
            </p>
            {!isOwner && (
              <button onClick={toggleFollow} className="mt-2 text-sm text-indigo-500 hover:underline">
                {following ? 'Unfollow' : 'Follow'}
              </button>
            )}
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
                  />
                )}
                <label className="mt-2 text-sm text-indigo-500 hover:underline cursor-pointer">
                  Change Avatar
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
                {uploadMsg && <p className="text-sm mt-1">{uploadMsg}</p>}
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
