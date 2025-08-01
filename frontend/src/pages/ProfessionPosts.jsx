import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import { feelings } from '../components/FeelingList';

const capitalize = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const ProfessionPosts = () => {
  const { profession } = useParams();
  const navigate = useNavigate();
  const [selectedFeeling, setSelectedFeeling] = useState('');

  const handleChange = (e) => {
    const val = e.target.value;
    setSelectedFeeling(val);
    if (val) {
      navigate(`/profession/${profession}/${val}`);
    } else {
      navigate(`/profession/${profession}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Posts for {profession}</h2>
      <select
        className="mb-4 p-2 border rounded"
        value={selectedFeeling}
        onChange={handleChange}
      >
        <option value="">All Feelings</option>
        {feelings.map((f) => (
          <option key={f} value={f}>
            {capitalize(f)}
          </option>
        ))}
      </select>
      <PostList initialUrl={`/posts/profession/${profession}/`} />
    </div>
  );
};

export default ProfessionPosts;
