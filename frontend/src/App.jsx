import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import UserPosts from './pages/UserPosts'; // ← NEW
import FollowersList from './pages/FollowersList';
import FollowingList from './pages/FollowingList';
import TagPosts from './pages/TagPosts';
import Feed from './pages/Feed';
import Search from './pages/Search';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  return (
    <>
      <Navbar />
      {/* Mobile drawer toggles */}
      <div className="lg:hidden fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowLeft(true)}
          className="bg-indigo-600 text-white px-3 py-2 rounded"
        >
          Menu
        </button>
      </div>
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowRight(true)}
          className="bg-indigo-600 text-white px-3 py-2 rounded"
        >
          Menu
        </button>
      </div>
      <div className="flex">
        <LeftSidebar mobileOpen={showLeft} setMobileOpen={setShowLeft} />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/search" element={<Search />} />
            <Route path="/tag/:name" element={<TagPosts />} />
            <Route path="/user/:username" element={<UserPosts />} />
            <Route path="/user/:username/followers" element={<FollowersList />} />
            <Route path="/user/:username/following" element={<FollowingList />} />
            <Route path="/password-reset" element={<PasswordResetRequest />} />
            <Route path="/reset-password-confirm" element={<PasswordResetConfirm />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
        </main>
        <RightSidebar mobileOpen={showRight} setMobileOpen={setShowRight} />
      </div>
    </>
  );
}

export default App;
