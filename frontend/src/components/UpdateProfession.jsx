import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfession, clearProfessionStatus } from "../actions/actions";
import { professions } from "./ProfessionList";

const capitalize = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const UpdateProfession = ({ initialProfession = "" }) => {
  const [profession, setProfession] = useState(initialProfession);
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const updateStatus = useSelector((state) => state.user.professionUpdateStatus);

  const handleUpdate = () => {
    setMsg("Updating...");
    dispatch(updateProfession(profession));
  };

  useEffect(() => {
    if (updateStatus === "success") {
      setMsg("Profession updated successfully ✅");
      dispatch(clearProfessionStatus());
    } else if (updateStatus === "error") {
      setMsg("Failed to update profession ❌");
      dispatch(clearProfessionStatus());
    }
  }, [updateStatus, dispatch]);

  return (
    <div className="p-4 bg-white rounded shadow mt-2">
      <h2 className="text-lg font-semibold">Update Profession</h2>
      <select
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
        className="w-full p-2 border rounded mt-2"
      >
        <option value="">Select a profession</option>
        {professions.map((p) => (
          <option key={p} value={p}>
            {capitalize(p)}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded"
      >
        Save
      </button>
      {msg && <p className="text-green-500 mt-2">{msg}</p>}
    </div>
  );
};

export default UpdateProfession;
