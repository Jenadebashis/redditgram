import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import UserPosts from './pages/UserPosts'; // ← NEW
import Feed from './pages/Feed';
import Search from './pages/Search';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user/:username" element={<UserPosts />} /> {/* ← NEW */}
          <Route path="/password-reset" element={<PasswordResetRequest />} />
          <Route path="/reset-password-confirm" element={<PasswordResetConfirm />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
