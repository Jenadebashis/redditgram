import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/me/saved/")
      .then((res) => setPosts(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">Saved Posts</h2>
      <ul className="space-y-1">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              to={`/posts/${post.id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {post.caption}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedPosts;
