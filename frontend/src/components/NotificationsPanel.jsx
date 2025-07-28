import React, { useEffect, useState } from "react";
import API from "../api";

const NotificationsPanel = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    API.get("/notifications/?unread_first=true")
      .then((res) => {
        const list = res.data.results || res.data;
        setNotes(list);
        list.forEach((n) => {
          if (!n.is_read) {
            API.patch(`/notifications/${n.id}/`, { is_read: true })
              .catch((err) => console.error(err));
          }
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const renderMessage = (n) => {
    if (!n) return "";
    const postPart = n.post ? ` on post #${n.post}` : "";

    if (n.notification_type === "comment") {
      return `${n.from_username} commented on your post${postPart}`;
    }

    if (n.notification_type === "like") {
      return `${n.from_username} liked your post${postPart}`;
    }

    if (n.notification_type === "follow") {
      return `${n.from_username} followed you`;
    }

    return n.message || n.text || "";
  };

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">Notifications</h2>
      <ul className="space-y-1">
        {notes.map((n, idx) => (
          <li
            key={n.id || idx}
            className={`text-sm ${n.is_read ? '' : 'font-semibold'}`}
            onClick={() => {
              if (!n.is_read) {
                API.patch(`/notifications/${n.id}/`, { is_read: true })
                  .then(() => {
                    setNotes((prev) =>
                      prev.map((p) => (p.id === n.id ? { ...p, is_read: true } : p))
                    );
                  })
                  .catch((err) => console.error(err));
              }
            }}
          >
            {renderMessage(n)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;
