import React from 'react';
import PostList from '../components/PostList';
import StoriesList from '../components/StoriesList';

const Feed = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <StoriesList />
      <PostList initialUrl="/feed/" />
    </div>
  );
};

export default Feed;
