import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { TagIcon } from "@heroicons/react/24/solid";

const TagList = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    API.get("/tags/")
      .then((res) => setTags(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mb-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        <h2 className="font-semibold mb-2 flex items-center">
          <TagIcon className="w-4 h-4 mr-1" /> Trending Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id || tag}
              to={`/tag/${tag.name || tag}`}
              className="text-xs px-2 py-1 bg-gray-200 rounded"
            >
              #{tag.name || tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagList;
