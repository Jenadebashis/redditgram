import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import { professions } from '../components/ProfessionList';

const capitalize = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const FeelingPosts = () => {
  const { feeling } = useParams();
  const navigate = useNavigate();
  const [selectedProfession, setSelectedProfession] = useState('');

  const handleChange = (e) => {
    const val = e.target.value;
    setSelectedProfession(val);
    if (val) {
      navigate(`/profession/${val}/${feeling}`);
    } else {
      navigate(`/feeling/${feeling}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Posts about {feeling}</h2>
      <select
        className="mb-4 p-2 border rounded"
        value={selectedProfession}
        onChange={handleChange}
      >
        <option value="">All Professions</option>
        {professions.map((p) => (
          <option key={p} value={p}>
            {capitalize(p)}
          </option>
        ))}
      </select>
      <PostList initialUrl={`/posts/feeling/${feeling}/`} />
    </div>
  );
};

export default FeelingPosts;
