import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import UserList from './features/users/UserList';
import RoleList from './features/roles/RoleList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<UserList />} />
          <Route path="roles" element={<RoleList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
