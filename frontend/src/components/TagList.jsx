import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import CollapsibleSection from "./CollapsibleSection";

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/tags/")
      .then((res) => setTags(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CollapsibleSection header="Trending Tags" uniqueKey="trending-tags">
      <div className="flex flex-wrap gap-2">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-5 w-16 bg-gray-300 rounded animate-pulse"
              ></div>
            ))
          : tags.map((tag) => (
              <Link
                key={tag.id || tag}
                to={`/tag/${tag.name || tag}`}
                className="text-xs px-2 py-1 bg-gray-200 rounded"
              >
                #{tag.name || tag}
              </Link>
            ))}
      </div>
    </CollapsibleSection>
  );
};

export default TagList;
