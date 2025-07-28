import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const SavedPosts = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    API.get("/bookmarks/")
      .then((res) => setBookmarks(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  const remove = (id) => {
    API.delete(`/bookmarks/${id}/`)
      .then(() => setBookmarks(bookmarks.filter((b) => b.id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">Saved Posts</h2>
      <ul className="space-y-1">
        {bookmarks.map((b) => (
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
    </div>
  );
};

export default SavedPosts;
