import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LoginComponent } from './pages/identity/login';
import { Layout } from './layout';
import './index.css';
import { AuthProvider } from './providers/auth-provider';
import { ThemeProvider } from './context/theme-context';

import { ForgotPasswordComponent } from './pages/identity/forgot-password';
import { NotFoundComponent } from './pages/not-found';
import { ServicesProvider } from './providers/services-provider';

import { useDynamicRoutes } from './components/DynamicRoutes';

export default function App() {
  const [dynamicRoutes, dynamicNavigation] = useDynamicRoutes();
  return (
    <HashRouter>
      <ThemeProvider>
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
                <Route path="*" element={<NotFoundComponent />} />
              </Route>
            </Routes>
          </AuthProvider>
        </ServicesProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
