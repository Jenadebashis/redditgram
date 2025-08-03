import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import CreateStory from './pages/CreateStory';
import PostDetail from './pages/PostDetail';
import UserPosts from './pages/UserPosts'; // ← NEW
import FollowersList from './pages/FollowersList';
import FollowingList from './pages/FollowingList';
import TagPosts from './pages/TagPosts';
import ProfessionPosts from './pages/ProfessionPosts';
import FeelingPosts from './pages/FeelingPosts';
import ProfessionFeelingPosts from './pages/ProfessionFeelingPosts';
import Feed from './pages/Feed';
import Search from './pages/Search';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
import VerifyEmail from './pages/VerifyEmail';
import Chat from './pages/Chat';
import NotificationSettings from './pages/NotificationSettings';

function App() {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const toggleLeft = () => setShowLeft((v) => !v);
  const toggleRight = () => setShowRight((v) => !v);

  return (
    <>
      <Navbar onToggleLeft={toggleLeft} onToggleRight={toggleRight} />
      <div className="flex">
        <LeftSidebar mobileOpen={showLeft} setMobileOpen={setShowLeft} />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/create-story" element={<CreateStory />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/search" element={<Search />} />
            <Route path="/tag/:name" element={<TagPosts />} />
            <Route path="/profession/:profession" element={<ProfessionPosts />} />
            <Route path="/feeling/:feeling" element={<FeelingPosts />} />
            <Route path="/profession/:profession/:feeling" element={<ProfessionFeelingPosts />} />
            <Route path="/user/:username" element={<UserPosts />} />
            <Route path="/user/:username/followers" element={<FollowersList />} />
            <Route path="/user/:username/following" element={<FollowingList />} />
            <Route path="/password-reset" element={<PasswordResetRequest />} />
            <Route path="/reset-password-confirm" element={<PasswordResetConfirm />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/chat/:username" element={<Chat />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
          </Routes>
        </main>
        <RightSidebar mobileOpen={showRight} setMobileOpen={setShowRight} />
      </div>
    </>
  );
}

export default App;
