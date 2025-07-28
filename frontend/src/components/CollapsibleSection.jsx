import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

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
        className="flex items-center justify-between w-full font-semibold mb-2 text-gray-700 dark:text-gray-200"
      >
        <span>{header}</span>
        <span>{open ? "\u25BC" : "\u25B6"}</span>
      </button>
      <div className={open ? "" : "hidden"}>{children}</div>
    </div>
  );
};

CollapsibleSection.propTypes = {
  header: PropTypes.node.isRequired,
  uniqueKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CollapsibleSection;
