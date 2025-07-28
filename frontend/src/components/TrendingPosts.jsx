import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import CollapsibleSection from "./CollapsibleSection";

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts/trending/")
      .then((res) => setPosts(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <CollapsibleSection header="Trending Posts" uniqueKey="trending-posts">
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
    </CollapsibleSection>
  );
};

export default TrendingPosts;
