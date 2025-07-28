import React, { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import API from "../api";
import CollapsibleSection from "./CollapsibleSection";

const NotificationsPanel = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

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
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
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
    <CollapsibleSection
      header={(
        <>
          <BellIcon className="w-4 h-4 mr-1 inline" /> Notifications
        </>
      )}
      uniqueKey="notifications"
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
          : notes.map((n, idx) => (
              <li
                key={n.id || idx}
                className={`text-sm ${n.is_read ? '' : 'font-semibold'} text-gray-700 dark:text-gray-200`}
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
    </CollapsibleSection>
  );
};

export default NotificationsPanel;
