import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './auth-context';
import type { UserData, AuthContextType } from './auth-types';

interface JwtPayload {
  id?: string;
  role?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  schoolName?: string;
  currentSession?: {
    _id: string;
    academicSession: string;
    term: string;
    startDate: string;
    endDate: string;
  };
  profilePic?: string;
  studentClass?: {
    _id: string;
    className: string;
    level: string;
    section: string;
  };
  isVerified?: boolean;
  isPrincipal?: boolean;
  isFinancialOfficer?: boolean;
  schoolAccountStatus?: string;
  iat: number;
  exp?: number;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  /** ----------------------------------
   *   LOGOUT
   * ---------------------------------- */
  const logout = useCallback(() => {
    localStorage.removeItem('fasma_token');
    localStorage.removeItem('fasma_role');
    sessionStorage.removeItem('activeNavItem');
    sessionStorage.removeItem('filters');

    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /** ----------------------------------
   *   TOKEN VALIDITY CHECKER
   * ---------------------------------- */
  const checkTokenValidity = useCallback(() => {
    const token = localStorage.getItem('fasma_token');
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        logout();
      }
    } catch (err) {
      console.error("Invalid token:", err);
      logout();
    }
  }, [logout]);

  /** ----------------------------------
   *   INITIAL LOAD
   * ---------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem('fasma_token');
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Do not load expired token
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      setUser({
        id: decoded.id || '',
        role: decoded.role || '',
        fullName: decoded.fullName,
        email: decoded.email || '',
        phoneNumber: decoded.phoneNumber || '',
        schoolName: decoded.schoolName || '',
        currentSession: decoded.currentSession!,
        profilePic: decoded.profilePic || '',
        studentClass: decoded.studentClass,
        isVerified: decoded.isVerified,
        isPrincipal: decoded.isPrincipal,
        isFinancialOfficer: decoded.isFinancialOfficer,
        schoolAccountStatus: decoded.schoolAccountStatus
      });

      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error decoding token:", err);
      logout();
    }
  }, [logout]);


  /** ----------------------------------
   *   BACKGROUND EXPIRY CHECKER
   *   Runs every 30 seconds
   * ---------------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  /** ----------------------------------
   *   LOGIN
   * ---------------------------------- */
  const login = (token: string) => {
    localStorage.setItem('fasma_token', token);

    const decoded = jwtDecode<JwtPayload>(token);
    localStorage.setItem('fasma_role', decoded.role || '');

    setUser({
      id: decoded.id || '',
      role: decoded.role || '',
      fullName: decoded.fullName,
      email: decoded.email || '',
      phoneNumber: decoded.phoneNumber || '',
      schoolName: decoded.schoolName || '',
      currentSession: decoded.currentSession!,
      profilePic: decoded.profilePic || '',
      studentClass: decoded.studentClass,
      isVerified: decoded.isVerified,
      isPrincipal: decoded.isPrincipal,
      isFinancialOfficer: decoded.isFinancialOfficer,
      schoolAccountStatus: decoded.schoolAccountStatus
    });

    setIsAuthenticated(true);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}