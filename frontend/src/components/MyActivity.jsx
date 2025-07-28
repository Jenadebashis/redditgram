import React, { useEffect, useState } from "react";
import API from "../api";

const MyActivity = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/me/activity/")
      .then((res) => setItems(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">My Activity</h2>
      <ul className="space-y-1">
        {items.map((act, idx) => (
          <li key={act.id || idx} className="text-sm">
            {act.text || act.action}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyActivity;
