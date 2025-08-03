import React, { useEffect, useState, useCallback } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import API from "../api";
import { WS_BASE_URL } from "../config";
import CollapsibleSection from "./CollapsibleSection";

const NotificationsPanel = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(() => {
    return API.get("/notifications/?unread_first=true")
      .then((res) => {
        const list = res.data.results || res.data;
        setNotes(list);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchNotifications().finally(() => setLoading(false));
  }, [fetchNotifications]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;
    const ws = new WebSocket(`${WS_BASE_URL}/ws/notifications/`, token);
    ws.onmessage = () => {
      fetchNotifications();
    };
    return () => ws.close();
  }, [fetchNotifications]);

  const markAllRead = () => {
    API.post("/notifications/mark_all_read/")
      .then(() =>
        setNotes((prev) => prev.map((n) => ({ ...n, is_read: true })))
      )
      .catch((err) => console.error(err));
  };

  const clearAll = () => {
    API.delete("/notifications/clear_all/")
      .then(() => setNotes([]))
      .catch((err) => console.error(err));
  };

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
          <BellIcon className="w-4 h-4 mr-1 text-indigo-600 bg-indigo-100 rounded-full p-1" /> Notifications
        </>
      )}
      uniqueKey="notifications"
    >
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-md max-h-64 overflow-y-auto sidebar-scrollbar">
        <div className="text-right mb-2 space-x-2 text-sm">
          <button onClick={markAllRead} className="hover:underline">
            Mark all as read
          </button>
          <button onClick={clearAll} className="hover:underline text-red-500">
            Clear all
          </button>
        </div>
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
                className={`text-sm ${n.is_read ? '' : 'font-semibold'} text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded px-1 cursor-pointer`}
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
