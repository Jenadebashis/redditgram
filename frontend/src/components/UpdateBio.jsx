import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBio } from "../actions/actions";

const EditBio = ({ initialBio = "" }) => {
  const [bio, setBio] = useState(initialBio);
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();

  let updateStatus = useSelector(state => state.user.bioUpdateStatus);

  const defaultBio = "Tell us about yourself!";

  const handleUpdate = () => {
    setMsg("Updating...");
    dispatch(updateBio(bio));
  };

  useEffect(() => {
    if (updateStatus === "success") {
      setMsg("Bio updated successfully ✅");
      updateStatus = null; // Reset status after showing message
    } else if (updateStatus === "error") {
      setMsg("Failed to update bio ❌");
      updateStatus = null; // Reset status after showing message
    }
  }, [updateStatus]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Edit Bio</h2>
      <textarea
        placeholder={defaultBio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 border rounded mt-2"
      />
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

export default EditBio;
