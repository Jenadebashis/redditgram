import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/posts/trending/")
      .then((res) => setPosts(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">Trending Posts</h2>
      <ul className="space-y-1">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <li
                key={idx}
                className="h-4 bg-gray-300 rounded animate-pulse"
              ></li>
            ))
          : posts.map((p) => (
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
