import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import API from "../api";

const SuggestedUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/users/suggested/")
      .then((res) => setUsers(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mb-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        <h2 className="font-semibold mb-2 flex items-center">
          <UserGroupIcon className="w-4 h-4 mr-1" /> Suggested Users
        </h2>
        <ul className="space-y-1">
          {users.map((user) => (
            <li key={user.id || user.username}>
              <Link
                to={`/user/${user.username}`}
                className="text-sm text-blue-600 hover:underline"
            >
              @{user.username}
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
};

export default SuggestedUsers;
