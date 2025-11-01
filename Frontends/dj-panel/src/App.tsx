import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LoginComponent } from './pages/identity/login';
import { Layout } from './layout';
import './index.css';
import { AuthProvider } from './providers/auth-provider';

import { ForgotPasswordComponent } from './pages/identity/forgot-password';
import { ServicesProvider } from './providers/services-provider';

import { useDynamicRoutes } from './components/DynamicRoutes';

export default function App() {
  const [dynamicRoutes, dynamicNavigation] = useDynamicRoutes();
  return (
    <HashRouter>
      <ServicesProvider>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={<Layout navigation={{ links: dynamicNavigation }} />}
            >
              <Route path="users">
                <Route path="login" element={<LoginComponent />} />
                <Route
                  path="forgot-password"
                  element={<ForgotPasswordComponent />}
                />
              </Route>
              {dynamicRoutes}
            </Route>
          </Routes>
        </AuthProvider>
      </ServicesProvider>
    </HashRouter>
  );
}
