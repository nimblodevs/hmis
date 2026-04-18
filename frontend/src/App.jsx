import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }      from './context/AuthContext';
import { PatientProvider }   from './context/PatientContext';

import CreateToken           from './pages/queues/CreateToken';
import QueueDashboard        from './pages/queues/QueueDashboard';

import TriageDashboard      from './pages/triage/TriageDashboard';
import TriageAssessment     from './pages/triage/TriageAssessment';

import RegistrationDashboard from './pages/registration/RegistrationDashboard';
import PatientRegistration   from './pages/registration/PatientRegistration';

import BillingDashboard      from './pages/billing/BillingDashboard';
import BillingPage           from './pages/billing/BillingPage';

import DoctorDashboard       from './pages/doctor/DoctorDashboard';
import DoctorClerking        from './pages/doctor/DoctorClerking';

import LabDashboard          from './pages/laboratory/LabDashboard';
import LabProcessingPage     from './pages/laboratory/LabProcessingPage';

import PharmacyDashboard     from './pages/pharmacy/PharmacyDashboard';
import PharmacyDispensePage  from './pages/pharmacy/PharmacyDispensePage';

import ReportsDashboard      from './pages/reports/ReportsDashboard';

function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <BrowserRouter>
          <Routes>
            {/* Token kiosk (default) */}
            <Route path="/"             element={<CreateToken />} />

            {/* HMS module — all pages share PatientContext */}
            <Route path="/hms"          element={<Navigate to="/hms/queue" replace />} />
            <Route path="/hms/queue"    element={<QueueDashboard />} />
            
            <Route path="/hms/triage"          element={<TriageDashboard />} />
            <Route path="/hms/triage/assess"   element={<TriageAssessment />} />
            
            <Route path="/hms/register"        element={<RegistrationDashboard />} />
            <Route path="/hms/registration/process" element={<PatientRegistration />} />
            
            <Route path="/hms/billing"         element={<BillingDashboard />} />
            <Route path="/hms/billing/process" element={<BillingPage />} />
            
            <Route path="/hms/doctor"          element={<DoctorDashboard />} />
            <Route path="/hms/doctor/clerk"    element={<DoctorClerking />} />
            
            <Route path="/hms/lab"             element={<LabDashboard />} />
            <Route path="/hms/lab/process"      element={<LabProcessingPage />} />
            
            <Route path="/hms/pharmacy"        element={<PharmacyDashboard />} />
            <Route path="/hms/pharmacy/dispense" element={<PharmacyDispensePage />} />
            
            <Route path="/hms/reports"  element={<ReportsDashboard />} />

            {/* Catch-all */}
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PatientProvider>
    </AuthProvider>
  );
}

export default App;
