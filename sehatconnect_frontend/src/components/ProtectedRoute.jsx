import React from "react";
import { Navigate, useParams } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const hwData = JSON.parse(localStorage.getItem("hwData"));
  const adminData = JSON.parse(localStorage.getItem("adminData"));
  const doctorData = JSON.parse(localStorage.getItem("doctorData"));
  const patientData = JSON.parse(localStorage.getItem("patientData"));

  const { id } = useParams(); 

  let isAuthorized = false;

  switch (allowedRole) {
    case "healthworker":
      isAuthorized = hwData?.healthworker?._id === id;
      break;
    case "admin":
      isAuthorized = !!adminData?.admin;
      break;
    case "doctor":
      isAuthorized = doctorData?.doctor?._id === id;
      break;
    case "patient":
      isAuthorized = patientData?.patient?._id === id;
      break;
    default:
      isAuthorized = false;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
