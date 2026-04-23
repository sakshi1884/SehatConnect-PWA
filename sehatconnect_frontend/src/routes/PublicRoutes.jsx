import React from "react";
import { Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";

export const PublicRoutes = () => (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
  </>
);
