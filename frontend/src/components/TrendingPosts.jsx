import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FireIcon } from "@heroicons/react/24/outline";
import API from "../api";
import CollapsibleSection from "./CollapsibleSection";

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
    <CollapsibleSection
      header={(
        <>
          <FireIcon className="w-4 h-4 mr-1 text-indigo-600 bg-indigo-100 rounded-full p-1" /> Trending Posts
        </>
      )}
      uniqueKey="trending-posts"
    >
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-md max-h-64 overflow-y-auto sidebar-scrollbar">
        <ul className="space-y-1 text-gray-700 dark:text-gray-200">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <li
                key={idx}
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
              ></li>
            ))
          : posts.map((p) => (
              <li key={p.id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded px-1">
                <Link
                  to={`/posts/${p.id}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {p.caption}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </CollapsibleSection>
  );
};

export default TrendingPosts;
