import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }      from './context/AuthContext';
import { PatientProvider }   from './context/PatientContext';

import CreateToken           from './pages/queues/CreateToken';
import QueueDashboard        from './pages/queues/QueueDashboard';
import TriageAssessment      from './pages/triage/TriageAssessment';
import PatientRegistration   from './pages/registration/PatientRegistration';
import BillingDashboard      from './pages/billing/BillingDashboard';
import DoctorClerking        from './pages/doctor/DoctorClerking';
import LabDashboard          from './pages/laboratory/LabDashboard';
import PharmacyDashboard     from './pages/pharmacy/PharmacyDashboard';
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
            <Route path="/hms/triage"   element={<TriageAssessment />} />
            <Route path="/hms/register" element={<PatientRegistration />} />
            <Route path="/hms/billing"  element={<BillingDashboard />} />
            <Route path="/hms/doctor"   element={<DoctorClerking />} />
            <Route path="/hms/lab"      element={<LabDashboard />} />
            <Route path="/hms/pharmacy" element={<PharmacyDashboard />} />
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
