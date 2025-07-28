import React, { useEffect, useState } from "react";
import API from "../api";
import CollapsibleSection from "./CollapsibleSection";

const MyActivity = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/profile/stats/")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <CollapsibleSection header="My Activity" uniqueKey="my-activity">
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
    </CollapsibleSection>
  );
};

export default MyActivity;
