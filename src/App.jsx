import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import Layout from './components/layout/Layout';

// Lazy load components for better performance
const UserList = React.lazy(() => import('./features/users/UserList'));
const RoleList = React.lazy(() => import('./features/roles/RoleList'));
const PermissionList = React.lazy(() => import('./features/permissions/PermissionList'));

// Loading fallback component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/users" replace />} />
            <Route path="users/*" element={<UserList />} />
            <Route path="roles/*" element={<RoleList />} />
            <Route path="permissions" element={<PermissionList />} />
            <Route path="*" element={<Navigate to="/users" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
