import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

const TagList = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    API.get("/tags/")
      .then((res) => setTags(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mb-6 p-4 bg-white rounded shadow text-gray-700 dark:bg-gray-900 dark:text-gray-200">
      <h2 className="font-semibold mb-2">Trending Tags</h2>
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
  );
};

export default TagList;
