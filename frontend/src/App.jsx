import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import CommandCenter from './pages/CommandCenter';
import PatientList from './pages/patients/PatientList';
import EMRDashboard from './pages/emr/EMRDashboard';
import BedManagementDashboard from './pages/beds/BedManagementDashboard';
import QueueDashboard from './pages/queues/QueueDashboard';
import CreateToken from './pages/queues/CreateToken';
import { AuthProvider } from './context/AuthContext';

// Placeholder for missing modules
const PlaceholderPage = ({ title }) => (
  <div className="h-full flex items-center justify-center flex-col text-clay-500">
    <div className="text-6xl mb-4 opacity-20">🏗️</div>
    <h2 className="text-2xl font-bold text-clay-700 mb-2">{title}</h2>
    <p>This module is currently under development.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/emr" element={<EMRDashboard />} />
          <Route path="/beds" element={<BedManagementDashboard />} />
          <Route path="/queues" element={<QueueDashboard />} />
          <Route path="/queues/token" element={<CreateToken />} />
          <Route path="/schedule" element={<PlaceholderPage title="Doctor Scheduling" />} />
          <Route path="/surgery" element={<PlaceholderPage title="Operating Theatre" />} />
          <Route path="/lab" element={<PlaceholderPage title="Laboratory" />} />
          <Route path="/radiology" element={<PlaceholderPage title="Radiology" />} />
          <Route path="/pharmacy" element={<PlaceholderPage title="Pharmacy" />} />
          <Route path="/billing" element={<PlaceholderPage title="Billing & Revenue Cycle" />} />
          <Route path="/insurance" element={<PlaceholderPage title="Insurance Claims" />} />
          <Route path="/inventory" element={<PlaceholderPage title="Inventory & Stores" />} />
          <Route path="/procurement" element={<PlaceholderPage title="Procurement" />} />
          <Route path="/finance" element={<PlaceholderPage title="Finance & Accounting" />} />
          <Route path="/hr" element={<PlaceholderPage title="HR & Payroll" />} />
          <Route path="/analytics" element={<PlaceholderPage title="Population Health & Analytics" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
