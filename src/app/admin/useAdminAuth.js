"use client";
import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = "pimlico2026";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const authStatus = sessionStorage.getItem('xhs-admin-auth');
    if (authStatus === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('xhs-admin-auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('xhs-admin-auth');
  };

  return { isAuthenticated, password, setPassword, passwordError, handleLogin, handleLogout };
}
