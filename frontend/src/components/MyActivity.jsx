import React, { useEffect, useState } from "react";
import API from "../api";

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
    <div className="mb-6">
      <h2 className="font-semibold mb-2">My Activity</h2>
      <ul className="space-y-1">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <li
              key={idx}
              className="h-4 bg-gray-300 rounded animate-pulse"
            ></li>
          ))
        ) : (
          stats && (
            <>
              <li className="text-sm">Posts: {stats.post_count}</li>
              <li className="text-sm">Following: {stats.following_count}</li>
              <li className="text-sm">Followers: {stats.follower_count}</li>
              <li className="text-sm">Saved Posts: {stats.bookmark_count}</li>
            </>
          )
        )}
      </ul>
    </div>
  );
};

export default MyActivity;
