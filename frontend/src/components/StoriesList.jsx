import React, { useEffect, useState } from 'react';
import API from '../api';

const StoriesList = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    API.get('/stories/')
      .then((res) => setStories(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  if (stories.length === 0) return null;

  return (
    <div className="flex space-x-2 overflow-x-auto mb-4">
      {stories.map((s) => (
        <div key={s.id} className="w-20 h-20 flex-shrink-0">
          {s.file.match(/\.mp4$/) ? (
            <video src={s.file} className="w-full h-full object-cover rounded" muted autoPlay loop />
          ) : (
            <img src={s.file} alt="story" className="w-full h-full object-cover rounded" />
          )}
        </div>
      ))}
    </div>
  );
};

export default StoriesList;
