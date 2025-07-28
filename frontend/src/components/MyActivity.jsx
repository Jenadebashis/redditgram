import React, { useEffect, useState } from "react";
import API from "../api";
import { ChartBarIcon } from "@heroicons/react/24/solid";

const MyActivity = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/profile/stats/")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mb-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        <h2 className="font-semibold mb-2 flex items-center">
          <ChartBarIcon className="w-4 h-4 mr-1" /> My Activity
        </h2>
        <ul className="space-y-1">
          {stats && (
            <>
              <li className="text-sm">Posts: {stats.post_count}</li>
              <li className="text-sm">Following: {stats.following_count}</li>
              <li className="text-sm">Followers: {stats.follower_count}</li>
              <li className="text-sm">Saved Posts: {stats.bookmark_count}</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyActivity;
