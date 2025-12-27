import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

const AdminApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/queries" element={<AdminDashboard />} />
      <Route path="/users" element={<AdminDashboard />} />
      <Route path="/settings" element={<AdminDashboard />} />
      <Route path="/products" element={<AdminDashboard />} />
      <Route path="/products/add" element={<AdminDashboard />} />
      <Route path="/products/edit" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminApp;
