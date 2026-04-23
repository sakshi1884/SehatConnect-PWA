import React from "react";
import { Route } from "react-router-dom";
import Healthworker from "../pages/healthworker/Healthworker";
import AddPatient from "../pages/healthworker/AddPatient";
import AllPatients from "../pages/healthworker/AllPatients";
import PatientDetails from "../pages/healthworker/PatientDetails";
import PatientDashboard from "../pages/healthworker/PatientDashboard";
import NewCheckupForm from "../pages/healthworker/NewCheckupForm";
import PatientHistory from "../pages/healthworker/PatientHistory";
import HWProfile from "../pages/healthworker/HWProfile";
import HealthCamp from "../pages/healthworker/HealthCamp";

export const HealthworkerRoutes = () => (
  <>
    <Route path="/healthworker" element={<Healthworker />} />
    <Route path="/healthworker/addpatient" element={<AddPatient />} />
    <Route path="/healthworker/allPatients" element={<AllPatients />} />
    <Route path="/healthworker/profile" element={<HWProfile />} />
    <Route path="/healthworker/patient/:id/details" element={<PatientDetails />} />
    <Route path="/healthworker/patient/:id/dashboard" element={<PatientDashboard />} />
    <Route path="/healthworker/patient/:id/edit" element={<PatientDetails isEditMode={true} />} />
    <Route path="/healthworker/patient/:id/checkup" element={<NewCheckupForm />} />
    <Route path="/healthworker/patient/:id/history" element={<PatientHistory />} />
    <Route path="/healthworker/healthcamps" element={<HealthCamp />} />
  </>
);
