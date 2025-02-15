import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Loading from "./pages/Loading";
import ErrorPage from "./pages/ErrorPage";
import AllUsersPage from "./pages/AllUsersPage";
import Myfile from "./pages/Myfile";
import SendPage from "./pages/SendPage";
import "./styles/global.style.css";
import MyProfile from "./pages/MyProfile";
import AllUsersLeaderBoard from "./pages/AllUsersLeaderBoard";
import AllUserTransaction from "./pages/AllUserTransaction";
import UserProfile from "./pages/UserProfile";
import Modal from "./components/Modal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/modal" element={<Modal />} />
      <Route path="/my-profile/:userId" element={<Myfile />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<AllUsersPage />} />
      <Route path="/send/:id" element={<SendPage />} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="/my-page/:userId" element={<MyProfile />} />
      <Route path="/user/:userId" element={<UserProfile />} />
      <Route path="/leaderboard" element={<AllUsersLeaderBoard />} />
      <Route path="/transactions" element={<AllUserTransaction />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
