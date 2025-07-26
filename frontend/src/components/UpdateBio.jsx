import React, { useEffect, useState } from "react";
import API from "../api";

const EditBio = ({ initialBio, onUpdate }) => {
  const [bio, setBio] = useState(initialBio || "");
  const [msg, setMsg] = useState("");
  const defaultBio = "Tell us about yourself!";

  useEffect(() => {
    API.get("/profile/bio/").then((res) => setBio(res.data.bio));
  }, []);

  const updateBio = () => {
    API.put("/profile/bio/", { bio }).then((res) => {
      setMsg("Bio updated successfully ✅");
      onUpdate(res.data.bio);
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Edit Bio</h2>
      <textarea
        placeholder={defaultBio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 border rounded mt-2"
      />
      <button
        onClick={updateBio}
        className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded"
      >
        Save
      </button>
      {msg && <p className="text-green-500 mt-2">{msg}</p>}
    </div>
  );
};

export default EditBio;
