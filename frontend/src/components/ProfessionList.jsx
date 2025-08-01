import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import CollapsibleSection from "./CollapsibleSection";

const professions = [
  "doctor",
  "engineer",
  "teacher",
  "lawyer",
  "nurse",
  "scientist",
  "accountant",
  "artist",
  "manager",
  "developer",
];

const capitalize = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const ProfessionList = () => (
  <CollapsibleSection
    header={(
      <>
        <BriefcaseIcon className="w-4 h-4 mr-1 text-indigo-600 bg-indigo-100 rounded-full p-1" /> Professions
      </>
    )}
    uniqueKey="professions"
  >
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-md">
      <div className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-200">
        {professions.map((p) => (
          <Link
            key={p}
            to={`/profession/${p}`}
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {capitalize(p)}
          </Link>
        ))}
      </div>
    </div>
  </CollapsibleSection>
);

export default ProfessionList;
