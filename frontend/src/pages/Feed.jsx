import React from 'react';
import PostList from '../components/PostList';

const Feed = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <PostList initialUrl="/feed/" />
    </div>
  );
};

export default Feed;
