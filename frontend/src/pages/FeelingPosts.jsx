import React from 'react';
import { useParams } from 'react-router-dom';
import PostList from '../components/PostList';

const FeelingPosts = () => {
  const { feeling } = useParams();
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Posts about {feeling}</h2>
      <PostList initialUrl={`/posts/feeling/${feeling}/`} />
    </div>
  );
};

export default FeelingPosts;
