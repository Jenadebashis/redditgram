import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TrendingPosts from "./TrendingPosts";
import TagList from "./TagList";
import SuggestedUsers from "./SuggestedUsers";
import { XMarkIcon } from "@heroicons/react/24/outline";

const LeftSidebar = ({ mobileOpen, setMobileOpen }) => {
  const content = (
    <div className="p-4 space-y-6 text-gray-700 dark:text-gray-200">
      <TrendingPosts />
      <TagList />
      <SuggestedUsers />
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto text-gray-700 dark:text-gray-200">
        {content}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="lg:hidden fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto text-gray-700 dark:text-gray-200"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-right block ml-auto mr-2 mt-2"
              >
                Close
              </button>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeftSidebar;
