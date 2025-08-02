import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { likeComment } from "../api";
import { motion } from "framer-motion";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
// Utility to generate background color from username and caption
const getColorFromUsername = (username, caption = "") => {
  const text = `${username || ""}${caption}`;
  if (!text) return "bg-green-500";

  const colors = [
    "bg-red-500",
    "bg-red-600",
    "bg-orange-500",
    "bg-orange-600",
    "bg-amber-500",
    "bg-amber-600",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-green-600",
    "bg-emerald-500",
    "bg-emerald-600",
    "bg-teal-500",
    "bg-teal-600",
    "bg-cyan-500",
    "bg-cyan-600",
    "bg-sky-500",
    "bg-sky-600",
    "bg-blue-500",
    "bg-blue-600",
    "bg-indigo-500",
    "bg-indigo-600",
    "bg-violet-500",
    "bg-violet-600",
    "bg-purple-500",
    "bg-purple-600",
    "bg-fuchsia-500",
    "bg-fuchsia-600",
    "bg-pink-500",
    "bg-pink-600",
    "bg-rose-500",
    "bg-rose-600",
    "bg-red-700",
    "bg-orange-700",
    "bg-amber-700",
    "bg-yellow-600",
    "bg-lime-600",
    "bg-green-700",
    "bg-emerald-700",
    "bg-teal-700",
    "bg-cyan-700",
    "bg-sky-700",
    "bg-blue-700",
    "bg-indigo-700",
    "bg-violet-700",
    "bg-purple-700",
    "bg-fuchsia-700",
    "bg-pink-700",
    "bg-rose-700",
    "bg-lime-700",
  ];

  let sum = 0;
  for (let i = 0; i < text.length; i++) {
    sum += text.charCodeAt(i);
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
  const bgColor = getColorFromUsername(post.author_username, post.caption);
  const initial = post.author_username?.charAt(0).toUpperCase();
  const avatarImage = post.author_avatar || getAvatarImage(post.author_username);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const [liked, setLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [bookmarked, setBookmarked] = useState(post.is_bookmarked);
  const [bookmarkId, setBookmarkId] = useState(post.bookmark_id);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [openThreads, setOpenThreads] = useState({});
  const loggedInUsername = localStorage.getItem('username');

  const toggleReplies = (id) => {
    setOpenThreads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchComments = async () => {
    const res = await API.get(`/posts/${post.id}/comments/`);
    const commentsWithReplies = await Promise.all(
      res.data.results.map(async (c) => {
        const repliesRes = await API.get(`/comments/${c.id}/replies/`);
        return { ...c, replies: repliesRes.data.results };
      })
    );
    setComments({ ...res.data, results: commentsWithReplies });
    setOpenThreads({});
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, post.id]);

  useEffect(() => {
    setOpenThreads({});
  }, [post.id]);

  const toggleLike = async () => {
    try {
      const res = await API.post(`/posts/${post.id}/like/`);
      setLiked(res.data.liked);
      setLikeCount(res.data.like_count);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await API.delete(`/bookmarks/${bookmarkId}/`);
        setBookmarked(false);
        setBookmarkId(null);
      } else {
        const res = await API.post('/bookmarks/', { post: post.id });
        setBookmarked(true);
        setBookmarkId(res.data.id);
      }
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
      await fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await API.post(`/comments/${parentId}/replies/`, { text: replyText });
      setReplyText("");
      setReplyingId(null);
      await fetchComments();
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
      await fetchComments();
      setEditCommentId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (id) => {
    try {
      await API.delete(`/comments/${id}/`);
      await fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCommentLike = async (id) => {
    try {
      const data = await likeComment(id);
      const updateRecursive = (items) =>
        items.map((c) => {
          if (c.id === id) {
            return { ...c, is_liked: data.liked, like_count: data.like_count };
          }
          if (c.replies) {
            return { ...c, replies: updateRecursive(c.replies) };
          }
          return c;
        });
      setComments((prev) => ({ ...prev, results: updateRecursive(prev.results) }));
    } catch (err) {
      console.error(err);
    }
  };

  const renderComment = (c, depth = 0) => (
    <div key={c.id} className="text-sm mb-1" style={{ marginLeft: depth * 16 }}>
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
          {' '}
          {c.text}
          <button onClick={() => toggleCommentLike(c.id)} className="ml-1 text-xs">
            {c.is_liked ? '💖' : '🤍'} {c.like_count ?? 0}
          </button>
          <button onClick={() => { setReplyingId(c.id); setReplyText(''); }} className="ml-1 text-xs text-indigo-500">
            Reply
          </button>
          <button onClick={() => toggleReplies(c.id)} className="ml-1 text-xs">
            💬 {c.replies?.length ?? 0}
          </button>
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
      {replyingId === c.id && (
        <form onSubmit={(e) => handleReply(e, c.id)} className="mt-1 flex">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-grow text-black p-1 rounded"
            placeholder="Add a reply"
          />
          <button type="submit" className="ml-1 px-2 text-xs bg-indigo-600 rounded">
            Post
          </button>
        </form>
      )}
      {openThreads[c.id] && c.replies?.map?.((r) => renderComment(r, depth + 1))}
    </div>
  );


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
        <button onClick={toggleBookmark} className="text-sm">
          {bookmarked ? (
            <BookmarkIconSolid className="w-4 h-4 inline" />
          ) : (
            <BookmarkIconOutline className="w-4 h-4 inline" />
          )}
        </button>
        <span className="ml-auto text-xs text-white/80">
          {timeAgo} {post.is_edited && '(edited)'}
        </span>
      </div>

      {showComments && (
        <div className="mt-3 bg-white/10 p-3 rounded">
          {comments?.results?.map?.((c) => renderComment(c))}
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
