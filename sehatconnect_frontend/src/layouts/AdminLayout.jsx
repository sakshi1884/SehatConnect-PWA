import React from "react";
import { Outlet } from "react-router-dom";
import PNavbar from "../components/PNavbar";

const AdminLayout = () => {
  const userEmail = localStorage.getItem("userEmail") || "admin@sehatconnect.in";

  return (
    <>
      <PNavbar userEmail={userEmail} />
      <Outlet />
    </>
  );
};

export default AdminLayout;
