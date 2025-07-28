import React from "react";
import TrendingPosts from "./TrendingPosts";
import TagList from "./TagList";
import SuggestedUsers from "./SuggestedUsers";

const LeftSidebar = ({ mobileOpen, setMobileOpen }) => {
  const content = (
    <div className="p-4 space-y-6">
      <TrendingPosts />
      <TagList />
      <SuggestedUsers />
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {content}
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-right block ml-auto mr-2 mt-2"
          >
            Close
          </button>
          {content}
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
