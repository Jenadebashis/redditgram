import React from "react";

// Utility to generate background color from username
const getColorFromUsername = (username) => {
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

// 🔹 Reusable post card component
export const PostCard = ({ post }) => {
  return (
    <div
      key={post.id}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ${getColorFromUsername(
            post.author_username
          )}`}
        >
          {post.author_username?.charAt(0).toUpperCase()}
        </div>
        <p className="font-medium text-indigo-700 dark:text-indigo-300 text-sm">
          @{post.author_username}
        </p>
      </div>

      {/* Caption */}
      <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed whitespace-pre-wrap break-words">
        {post.caption}
      </p>

      {/* Timestamp */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-3">
        {new Date(post.created_at).toLocaleString()}
      </p>
    </div>
  );
};
