import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from './components/common/AppLayout';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Users from './components/users/Users';
import Panels from './components/panels/Panels';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="panels" element={<Panels />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
