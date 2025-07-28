import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const CollapsibleSection = ({ header, uniqueKey, children }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(uniqueKey);
    if (stored === "false") {
      setOpen(false);
    }
  }, [uniqueKey]);

  const toggle = () => {
    const newState = !open;
    setOpen(newState);
    localStorage.setItem(uniqueKey, newState);
  };

  return (
    <div className="mb-6">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full font-bold mb-2 text-gray-700 dark:text-gray-200"
      >
        <span className="flex items-center space-x-2">{header}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transform transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

CollapsibleSection.propTypes = {
  header: PropTypes.node.isRequired,
  uniqueKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CollapsibleSection;
