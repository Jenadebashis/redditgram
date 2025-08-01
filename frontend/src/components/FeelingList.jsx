import React from "react";
import { Link } from "react-router-dom";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import CollapsibleSection from "./CollapsibleSection";

const feelings = [
  "happy",
  "sad",
  "angry",
  "fear",
  "surprise",
  "disgust",
  "trust",
  "anticipation",
];

const capitalize = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const FeelingList = () => (
  <CollapsibleSection
    header={(
      <>
        <FaceSmileIcon className="w-4 h-4 mr-1 text-indigo-600 bg-indigo-100 rounded-full p-1" /> Feelings
      </>
    )}
    uniqueKey="feelings"
  >
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-md">
      <div className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-200">
        {feelings.map((f) => (
          <Link
            key={f}
            to={`/feeling/${f}`}
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {capitalize(f)}
          </Link>
        ))}
      </div>
    </div>
  </CollapsibleSection>
);

export default FeelingList;
