import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from './components/common/AppLayout';
import Login from './components/login/Login';
import Users from './components/users/Users';
import Panels from './components/panels/Panels';
import Batches from './components/batches/Batches';
import DashboardPage from './components/dashboard/DashboardPage';
import Customer from './components/customers/Customer';
import MyBatches from './components/batches/MyBatches';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="batches" element={<Batches />} />
          <Route path="my-batches" element={<MyBatches />} />
          <Route path="users" element={<Users />} />
          <Route path="customers" element={<Customer />} />
          <Route path="panels" element={<Panels />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
