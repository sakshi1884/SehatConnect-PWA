import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";

/* ADMIN */
import Admin from "./pages/admin/Admin";
import AllDoctors from "./pages/admin/AllDoctors";
import AllHealthworkers from "./pages/admin/AllHealthworkers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/admin/Profile";
import AdminHealthCamps from "./pages/admin/AdminHealthCamps";
import AddDoctor from "./pages/admin/AddDoctor";
import AddHW from "./pages/admin/AddHealthworker";

/* HEALTHWORKER */
import Healthworker from "./pages/healthworker/Healthworker";
import AllPatients from "./pages/healthworker/AllPatients";
import AddPatient from "./pages/healthworker/AddPatient";
import PatientHistory from "./pages/healthworker/PatientHistory";
import PatientDashboard from "./pages/healthworker/PatientDashboard";
import NewCheckupForm from "./pages/healthworker/NewCheckupForm";
import HWProfile from "./pages/healthworker/HWProfile";
import HealthCamp from "./pages/healthworker/HealthCamp";
import DetailsForm from "./pages/healthworker/DetailsForm";
import PatientInfo from "./pages/healthworker/PatientInfo";

/* DOCTOR */
import Doctor from "./pages/doctor/Doctor";
import DoctorProfile from "./pages/doctor/DoctorProfile"
import DAllPatients from "./pages/doctor/DAllPatients";
import DAddPatient from "./pages/doctor/DAddPatient";
import DPatientHistory from "./pages/doctor/DPatientHistory";
import DPatientDashboard from "./pages/doctor/DPatientDashboard";
import DCheckupForm from "./pages/doctor/DCheckupForm";
import DHealthCamp from "./pages/doctor/DHealthCamp";
import DDetailsForm from "./pages/doctor/DDetailsForm";
import DPatientInfo from "./pages/doctor/DPatientInfo";

// PATIENT
import Patient from "./pages/patient/Patient";
import PtDashboard from "./pages/patient/PtDashboard";
import PtHistory from "./pages/patient/PtHistory";
import PtDetails from "./pages/patient/PtDetails";
import PtProfile from "./pages/patient/PtProfile";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin/:id" element={
          <ProtectedRoute allowedRole="admin">
            <Admin />
          </ProtectedRoute>
        } />

        <Route path="/admin/:id/dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/:id/alldoctors" element={
          <ProtectedRoute allowedRole="admin">
            <AllDoctors />
          </ProtectedRoute>
        } />

        <Route path="/admin/:id/allhealthworkers" element={
          <ProtectedRoute allowedRole="admin">
            <AllHealthworkers />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/:id/profile" element={
          <ProtectedRoute allowedRole="admin">
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/admin/:id/healthcamps" element={
          <ProtectedRoute allowedRole="admin">
            <AdminHealthCamps />
          </ProtectedRoute>
        } />

        <Route path="/admin/:id/addDoctor" element={
          <ProtectedRoute allowedRole="admin">
            <AddDoctor />
          </ProtectedRoute>
        } />

        <Route path="/admin/:id/addhealthworker" element={
          <ProtectedRoute allowedRole="admin">
            <AddHW />
          </ProtectedRoute>
        } />

        {/* ================= HEALTHWORKER ================= */}
        <Route path="/healthworker/:id" element={
          <ProtectedRoute allowedRole="healthworker">
            <Healthworker />
          </ProtectedRoute>
        } />

        <Route path="/healthworker/:id/allpatients" element={
          <ProtectedRoute allowedRole="healthworker">
            <AllPatients />
          </ProtectedRoute>
        } />

        <Route path="/healthworker/:id/addpatient" element={
          <ProtectedRoute allowedRole="healthworker">
            <AddPatient />
          </ProtectedRoute>
        } />

        <Route path="/healthworker/:id/profile" element={
          <ProtectedRoute allowedRole="healthworker">
            <HWProfile />
          </ProtectedRoute>
        } />

        {/* 🔥 PATIENT FLOW (FIXED) */}
        <Route path="/healthworker/:id/patient/:pid/dashboard" element={
          <ProtectedRoute allowedRole="healthworker">
            <PatientDashboard />
          </ProtectedRoute>
        } />

        <Route path="/healthworker/:id/patient/:pid/detailsForm" element={
          <ProtectedRoute allowedRole="healthworker">
            <DetailsForm />
          </ProtectedRoute>
        } />

        <Route path="/healthworker/:id/patient/:pid/history" element={
          <ProtectedRoute allowedRole="healthworker">
            <PatientHistory />
          </ProtectedRoute>
        } />

        <Route path="/healthworker/:id/patient/:pid/checkup" element={
          <ProtectedRoute allowedRole="healthworker">
            <NewCheckupForm />
          </ProtectedRoute>
        } />

        

        <Route path="/healthworker/:id/healthcamps" element={
          <ProtectedRoute allowedRole="healthworker">
            <HealthCamp />
          </ProtectedRoute>
        } />

        <Route path="/healthworker/:id/patient/:pid/checkupForm" element={
          <ProtectedRoute allowedRole="healthworker">
            <NewCheckupForm />
          </ProtectedRoute>
        } />

        <Route path="/healthworker/:id/patient/:pid/info" element={
          <ProtectedRoute allowedRole="healthworker">
            <PatientInfo />
          </ProtectedRoute>
        } />


        

        {/* ================= DOCTOR ================= */}
        <Route path="/doctor/:id" element={
          <ProtectedRoute allowedRole="doctor">
            <Doctor />
          </ProtectedRoute>
        } />

        <Route path="/doctor/:id/profile" element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorProfile />
          </ProtectedRoute>
        } />

        <Route path="/doctor/:id/addpatient" element={
          <ProtectedRoute allowedRole="doctor">
            <DAddPatient />
          </ProtectedRoute>
        } />

        <Route path="/doctor/:id/allpatients" element={
          <ProtectedRoute allowedRole="doctor">
            <DAllPatients />
          </ProtectedRoute>
        } />

        <Route path="/doctor/:id/patient/:pid/dashboard" element={
          <ProtectedRoute allowedRole="doctor">
            <DPatientDashboard />
          </ProtectedRoute>
        } />

        <Route path="/doctor/:id/patient/:pid/detailsForm" element={
          <ProtectedRoute allowedRole="doctor">
            <DDetailsForm />
          </ProtectedRoute>
        } />

        <Route path="/doctor/:id/patient/:pid/history" element={
          <ProtectedRoute allowedRole="doctor">
            <DPatientHistory />
          </ProtectedRoute>
        } />

      

        <Route path="/doctor/:id/healthcamps" element={
          <ProtectedRoute allowedRole="doctor">
            <DHealthCamp />
          </ProtectedRoute>
        } />

        <Route path="/doctor/:id/patient/:pid/checkupForm" element={
          <ProtectedRoute allowedRole="doctor">
            <DCheckupForm />
          </ProtectedRoute>
        } />

        <Route path="/doctor/:id/patient/:pid/info" element={
          <ProtectedRoute allowedRole="doctor">
            <DPatientInfo />
          </ProtectedRoute>
        } />

        {/* ================= PATIENT ================= */}

        <Route path="/patient/:id" element={
          <ProtectedRoute allowedRole="patient">
            <Patient />
          </ProtectedRoute>
        } />

        <Route path="/patient/:id/dashboard" element={
          <ProtectedRoute allowedRole="patient">
            <PtDashboard />
          </ProtectedRoute>
        } />

        <Route path="/patient/:id/history" element={
          <ProtectedRoute allowedRole="patient">
            <PtHistory />
          </ProtectedRoute>
        } />

        <Route path="/patient/:id/details" element={
          <ProtectedRoute allowedRole="patient">
            <PtDetails />
          </ProtectedRoute>
        } />

        <Route path="/patient/:id/profile" element={
          <ProtectedRoute allowedRole="patient">
            <PtProfile/>
          </ProtectedRoute>
        } />


      </Routes>
    </Router>
  );
};

export default App;