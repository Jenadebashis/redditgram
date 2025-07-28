import React from "react";
import MyActivity from "./MyActivity";
import SavedPosts from "./SavedPosts";
import NotificationsPanel from "./NotificationsPanel";
import { XMarkIcon } from "@heroicons/react/24/outline";

const RightSidebar = ({ mobileOpen, setMobileOpen }) => {
  const content = (
    <div className="p-4 space-y-6">
      <MyActivity />
      <SavedPosts />
      <NotificationsPanel />
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {content}
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto relative">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-2 top-2 p-2"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          {content}
        </div>
      )}
    </>
  );
};

export default RightSidebar;
