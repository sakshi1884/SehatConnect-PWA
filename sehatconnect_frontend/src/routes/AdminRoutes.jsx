import React from "react";
import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Admin from "../pages/admin/Admin";
import AllDoctors from "../pages/admin/AllDoctors";
import AllHealthworkers from "../pages/admin/AllHealthworkers";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Profile from "../pages/admin/Profile";
import AdminHealthCamps from "../pages/admin/AdminHealthCamps";

export const AdminRoutes = () => (
  <Route element={<AdminLayout />}>
    <Route path="/admin" element={<Admin />} />
    <Route path="/admin/alldoctors" element={<AllDoctors />} />
    <Route path="/admin/allhealthworkers" element={<AllHealthworkers />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/profile" element={<Profile />} />
    <Route path="/admin/healthcamps" element={<AdminHealthCamps />} />
  </Route>
);
