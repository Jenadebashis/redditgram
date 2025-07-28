import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { TagIcon } from "@heroicons/react/24/outline";
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
    <CollapsibleSection
      header={(
        <>
          <TagIcon className="w-4 h-4 mr-1 text-indigo-600 bg-indigo-100 rounded-full p-1" /> Trending Tags
        </>
      )}
      uniqueKey="trending-tags"
    >
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-md">
        <div className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-200">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))
          : tags.map((tag) => (
              <Link
                key={tag.id || tag}
                to={`/tag/${tag.name || tag}`}
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                #{tag.name || tag}
              </Link>
            ))}
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default TagList;
