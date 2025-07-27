import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
// Utility to generate background color from username
const getColorFromUsername = (username) => {
  if (!username || typeof username !== "string") return "bg-green-500";

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
  ];

  let sum = 0;
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i);
  }

  return colors[sum % colors.length];
};

const getAvatarImage = (username) => {
  if (!username) return null;
  const imageCount = 5; // Assuming 7 profile images available
  if (typeof username !== "string") return `/profile_images/1.webp`; // Default image
  let sum = 0;
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i);
  }
  const imageIndex = (sum % imageCount) + 1; // 1 to 5
  return `/profile_images/${imageIndex}.webp`; // Assumes images are in /public
};


// 🔹 Reusable post card component
export const PostCard = ({ post }) => {
  const bgColor = getColorFromUsername(post.author_username);
  const initial = post.author_username?.charAt(0).toUpperCase();
  const avatarImage = post.author_avatar || getAvatarImage(post.author_username);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const [liked, setLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const loggedInUsername = localStorage.getItem('username');

  useEffect(() => {
    if (showComments) {
      API.get(`/posts/${post.id}/comments/`).then(res => setComments(res.data));
    }
  }, [showComments, post.id]);

  const toggleLike = async () => {
    try {
      const res = await API.post(`/posts/${post.id}/like/`);
      setLiked(res.data.liked);
      setLikeCount(res.data.like_count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await API.post(`/posts/${post.id}/comments/`, { text: newComment });
      setNewComment("");
      const res = await API.get(`/posts/${post.id}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (c) => {
    setEditCommentId(c.id);
    setEditText(c.text);
  };

  const saveEdit = async (id) => {
    try {
      await API.put(`/comments/${id}/`, { text: editText });
      const res = await API.get(`/posts/${post.id}/comments/`);
      setComments(res.data);
      setEditCommentId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (id) => {
    try {
      await API.delete(`/comments/${id}/`);
      const res = await API.get(`/posts/${post.id}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  console.log('the comments are: ', {comments});

  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4 }}
      className={`${bgColor} text-white rounded-xl p-5 mb-5 shadow-sm hover:shadow-lg transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        {avatarImage ? (
          <img
            src={avatarImage}
            alt={post.author_username}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
          />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold bg-white text-black shadow">
            {initial}
          </div>
        )}
        <Link to={`/user/${post.author_username}`} className="font-medium text-white text-sm hover:underline">
          @{post.author_username}
        </Link>
      </div>

      {/* Caption */}
      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
        {post.caption}
      </p>

      {/* Like & Comments */}
      <div className="flex items-center mt-3 space-x-4">
        <button onClick={toggleLike} className="text-sm">
          {liked ? "💖" : "🤍"} {likeCount}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="text-sm">
          💬 {post.comment_count}
        </button>
        <span className="ml-auto text-xs text-white/80">{timeAgo}</span>
      </div>

      {showComments && (
        <div className="mt-3 bg-white/10 p-3 rounded">
          {comments?.results?.map?.((c) => (
            <div key={c.id} className="text-sm mb-1">
              <strong>@{c.author_username}</strong>:
              {editCommentId === c.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="ml-1 p-1 rounded text-black"
                  />
                  <button onClick={() => saveEdit(c.id)} className="ml-1 text-xs text-indigo-500">
                    Save
                  </button>
                  <button onClick={() => setEditCommentId(null)} className="ml-1 text-xs text-gray-500">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {' '}{c.text}
                  {loggedInUsername === c.author_username && (
                    <>
                      <button onClick={() => startEdit(c)} className="ml-1 text-xs text-indigo-500">
                        Edit
                      </button>
                      <button onClick={() => deleteComment(c.id)} className="ml-1 text-xs text-red-500">
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
          <form onSubmit={handleComment} className="mt-2 flex">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow text-black p-1 rounded"
              placeholder="Add a comment"
            />
            <button type="submit" className="ml-2 px-2 text-sm bg-indigo-600 rounded">
              Post
            </button>
          </form>
        </div>
      )}
    </motion.div>
  );
};
