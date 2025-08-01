import React from 'react';
import { useParams } from 'react-router-dom';
import PostList from '../components/PostList';

const ProfessionFeelingPosts = () => {
  const { profession, feeling } = useParams();
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{profession} - {feeling}</h2>
      <PostList initialUrl={`/posts/profession/${profession}/feeling/${feeling}/`} />
    </div>
  );
};

export default ProfessionFeelingPosts;
