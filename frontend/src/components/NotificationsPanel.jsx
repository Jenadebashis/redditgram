import React, { useEffect, useState } from "react";
import API from "../api";

const NotificationsPanel = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    API.get("/notifications/")
      .then((res) => setNotes(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">Notifications</h2>
      <ul className="space-y-1">
        {notes.map((n, idx) => (
          <li key={n.id || idx} className="text-sm">
            {n.text || n.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;
