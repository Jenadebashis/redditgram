import React from 'react';
import { useParams } from 'react-router-dom';
import PostList from '../components/PostList';

const TagPosts = () => {
  const { name } = useParams();
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Posts tagged #{name}</h2>
      <PostList initialUrl={`/posts/tag/${name}/`} />
    </div>
  );
};

export default TagPosts;
