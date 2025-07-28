import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    <CollapsibleSection header="Suggested Users" uniqueKey="suggested-users">
      <ul className="space-y-1">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <li
                key={idx}
                className="h-4 bg-gray-300 rounded animate-pulse"
              ></li>
            ))
          : users.map((user) => (
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
    </CollapsibleSection>
  );
};

export default SuggestedUsers;
