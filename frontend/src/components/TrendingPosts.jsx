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
          <FireIcon className="w-4 h-4 mr-1 inline" /> Trending Posts
        </>
      )}
      uniqueKey="trending-posts"
    >
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
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
    </CollapsibleSection>
  );
};

export default TrendingPosts;
