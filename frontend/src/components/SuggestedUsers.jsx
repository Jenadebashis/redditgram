import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import CollapsibleSection from "./CollapsibleSection";

const SuggestedUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/users/suggested/")
      .then((res) => setUsers(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <CollapsibleSection header="Suggested Users" uniqueKey="suggested-users">
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
    </CollapsibleSection>
  );
};

export default SuggestedUsers;
