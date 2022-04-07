import React, { ReactElement } from 'react';
import Loading from './components/Loading';
import useLoginState from './hooks/useLoginState';
import LoginPage from './pages/LoginFirst/LoginFirstPage';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import AdminHome from './pages/AdminHome/AdminHome';
import LoggedInUserContext from './context/LoggedInUserContext';
import EditUserHome from './pages/EditUserHome/EditUserHome';
import Layout from './components/Layout';
import PlaylistHome from './pages/PlaylistHome/PlaylistHome';
import PlaylistEdit from './pages/PlaylistEdit/PlaylistEdit';
import UserVoiceActivity from './pages/UserVoiceActivity/UserVoiceActivity';
import EditServerHome from './pages/EditServerHome/EditServerHome';
import AutoActions from "./pages/AutoActions/AutoActions";
import RoleMenu from "./pages/RoleMenu/RoleMenu";

export default function Router(): ReactElement {
  const loginState = useLoginState();

  switch (loginState.state) {
    case 'loading':
      return <BrowserRouter><Layout><Loading /></Layout></BrowserRouter>;
    case 'loginFirst':
      return <BrowserRouter><LoginPage /></BrowserRouter>;
    case 'loggedInUser':
      return (
        <LoggedInUserContext.Provider value={loginState.user}>
          <BrowserRouter>
            <Routes>
              <Route path="/home" element={<Home />} />

              {/* User Routes */}
              <Route path="/user/:userId/home" element={<EditUserHome />} />
              <Route path="/user/:userId/playlist" element={<PlaylistHome />} />
              <Route path="/user/:userId/playlist/:playlistName/edit" element={<PlaylistEdit />} />
              <Route path="/user/:userId/activity" element={<UserVoiceActivity />} />

              {/* Server Routes */}
              <Route path="/server/:serverId/home" element={<EditServerHome />} />
              <Route path="/server/:serverId/actions" element={<AutoActions />} />
              <Route path="/server/:serverId/roleMenu" element={<RoleMenu />} />

              {/* Redirect everything unknown to /home */}
              <Route path="*" element={<Navigate replace to="/home" />} />
            </Routes>
          </BrowserRouter>
        </LoggedInUserContext.Provider>
      );
    case 'loggedInAdmin':
      return (
        <LoggedInUserContext.Provider value={loginState.user}>
          <BrowserRouter>
            <Routes>
              <Route path="/home" element={<AdminHome />} />

              {/* User Routes */}
              <Route path="/user/:userId/home" element={<EditUserHome />} />
              <Route path="/user/:userId/playlist" element={<PlaylistHome />} />
              <Route path="/user/:userId/playlist/:playlistName/edit" element={<PlaylistEdit />} />
              <Route path="/user/:userId/activity" element={<UserVoiceActivity />} />

              {/* Server Routes */}
              <Route path="/server/:serverId/home" element={<EditServerHome />} />
              <Route path="/server/:serverId/actions" element={<AutoActions />} />
              <Route path="/server/:serverId/roleMenu" element={<RoleMenu />} />

              <Route path="*" element={<Navigate replace to="/home" />} />
            </Routes>
          </BrowserRouter>
        </LoggedInUserContext.Provider>
      );
  }
}
