import React from "react";
import { Link } from "react-router-dom";
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
  const avatarImage = getAvatarImage(post.author_username);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  console.log('the value of the constants are:', {
    bgColor,
    initial,
    avatarImage,
    timeAgo,
  });

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

      {/* Timestamp */}
      <p className="text-xs text-white/80 text-right mt-3">{timeAgo}</p>
    </motion.div>
  );
};
