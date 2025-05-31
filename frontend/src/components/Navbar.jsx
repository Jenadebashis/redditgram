import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">RedditGram</Link>
      <div className="space-x-4">
        <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
        <Link to="/signup" className="text-gray-700 hover:text-indigo-600">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
