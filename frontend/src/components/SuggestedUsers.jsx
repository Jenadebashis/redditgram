import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import API from "../api";
import CollapsibleSection from "./CollapsibleSection";

const SuggestedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/users/suggested/")
      .then((res) => setUsers(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CollapsibleSection
      header={(
        <>
          <UserGroupIcon className="w-4 h-4 mr-1 inline" /> Suggested Users
        </>
      )}
      uniqueKey="suggested-users"
    >
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        <ul className="space-y-1 text-gray-700 dark:text-gray-200">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <li
                key={idx}
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
              ></li>
            ))
          : users.map((user) => (
              <li key={user.id || user.username}>
                <Link
                  to={`/user/${user.username}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  @{user.username}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </CollapsibleSection>
  );
};

export default SuggestedUsers;
