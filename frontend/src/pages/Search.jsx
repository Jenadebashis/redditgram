import { useState } from 'react';
import API from '../api';
import { PostCard } from '../components/PostCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await API.get(`/search/?q=${encodeURIComponent(query)}`);
      setPosts(res.data.posts);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow border p-2 rounded"
          placeholder="Search posts or users"
        />
        <button className="ml-2 px-4 bg-indigo-600 text-white rounded">Search</button>
      </form>

      {users.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Users</h3>
          {users.map((u) => (
            <div key={u.username} className="text-sm mb-1">
              @{u.username}
            </div>
          ))}
        </div>
      )}

      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
};

export default Search;
