import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts/trending/")
      .then((res) => setPosts(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mb-6 p-4 bg-white rounded shadow text-gray-700 dark:bg-gray-900 dark:text-gray-200">
      <h2 className="font-semibold mb-2">Trending Posts</h2>
      <ul className="space-y-1">
        {posts.map((p) => (
          <li key={p.id}>
            <Link
              to={`/posts/${p.id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {p.caption}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingPosts;
