import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import API from "../api";
import CollapsibleSection from "./CollapsibleSection";

const SavedPosts = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/bookmarks/")
      .then((res) => setBookmarks(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const remove = (id) => {
    API.delete(`/bookmarks/${id}/`)
      .then(() => setBookmarks(bookmarks.filter((b) => b.id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <CollapsibleSection
      header={(
        <>
          <BookmarkIcon className="w-4 h-4 mr-1 text-indigo-600 bg-indigo-100 rounded-full p-1" /> Saved Posts
        </>
      )}
      uniqueKey="saved-posts"
    >
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-md">
        <ul className="space-y-1 text-gray-700 dark:text-gray-200">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <li
                key={idx}
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
              ></li>
            ))
          : bookmarks.map((b) => (
              <li key={b.id} className="flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded px-1">
                <Link
                  to={`/posts/${b.post.id}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {b.post.caption}
                </Link>
                <button
                  onClick={() => remove(b.id)}
                  className="text-xs text-red-500 ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>
      </div>
    </CollapsibleSection>
  );
};

export default SavedPosts;
