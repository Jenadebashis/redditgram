import React from 'react';
import { useParams } from 'react-router-dom';
import PostList from '../components/PostList';

const ProfessionPosts = () => {
  const { profession } = useParams();
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Posts for {profession}</h2>
      <PostList initialUrl={`/posts/profession/${profession}/`} />
    </div>
  );
};

export default ProfessionPosts;
