import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    <CollapsibleSection header="Saved Posts" uniqueKey="saved-posts">
      <ul className="space-y-1">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <li
                key={idx}
                className="h-4 bg-gray-300 rounded animate-pulse"
              ></li>
            ))
          : bookmarks.map((b) => (
              <li key={b.id} className="flex items-center justify-between">
                <Link
                  to={`/posts/${b.post.id}`}
                  className="text-sm text-blue-600 hover:underline"
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
    </CollapsibleSection>
  );
};

export default SavedPosts;
