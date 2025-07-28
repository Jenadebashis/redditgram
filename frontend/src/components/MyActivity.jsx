import React, { useEffect, useState } from "react";
import API from "../api";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import CollapsibleSection from "./CollapsibleSection";

const MyActivity = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/profile/stats/")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CollapsibleSection
      header={(
        <>
          <ChartBarIcon className="w-4 h-4 mr-1 text-indigo-600 bg-indigo-100 rounded-full p-1" /> My Activity
        </>
      )}
      uniqueKey="my-activity"
    >
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-md">
        <ul className="space-y-1 text-gray-700 dark:text-gray-200">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <li
              key={idx}
              className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
            ></li>
          ))
        ) : (
          stats && (
            <>
              <li className="text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded px-1">Posts: {stats.post_count}</li>
              <li className="text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded px-1">Following: {stats.following_count}</li>
              <li className="text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded px-1">Followers: {stats.follower_count}</li>
              <li className="text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded px-1">Saved Posts: {stats.bookmark_count}</li>
            </>
          )
        )}
        </ul>
      </div>
    </CollapsibleSection>
  );
};

export default MyActivity;
