import React, { createContext, useContext, useState } from 'react';

// Common roles for our Tier 3 Hospital
export const ROLES = {
  ADMIN: 'System Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  RECEPTIONIST: 'Receptionist / Registrar',
  LAB_TECH: 'Laboratory Technician',
  PHARMACIST: 'Pharmacist',
  RADIOLOGIST: 'Radiologist',
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Start with Admin for easiest testing, but switchable via UI
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin User',
    role: ROLES.ADMIN,
  });

  const switchRole = (newRole) => {
    setCurrentUser({
      name: `Mock ${newRole}`,
      role: newRole
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
