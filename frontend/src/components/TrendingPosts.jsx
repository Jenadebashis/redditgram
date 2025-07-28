import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FireIcon } from "@heroicons/react/24/solid";
import API from "../api";

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts/trending/")
      .then((res) => setPosts(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mb-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        <h2 className="font-semibold mb-2 flex items-center">
          <FireIcon className="w-4 h-4 mr-1" /> Trending Posts
        </h2>
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
    </div>
  );
};

export default TrendingPosts;
