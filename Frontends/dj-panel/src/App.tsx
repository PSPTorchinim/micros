import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LoginComponent } from './pages/identity/login';
import { HomeComponent } from './pages/home';
import { Layout } from './layout';
import './index.css';

import { data } from './content/homePage';
import { footer } from './content/footer';
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
              element={
                <Layout
                  navigation={{ links: dynamicNavigation }}
                  footer={footer}
                />
              }
            >
              <Route path="users">
                <Route path="login" element={<LoginComponent />} />
                <Route
                  path="forgot-password"
                  element={<ForgotPasswordComponent />}
                />
              </Route>
              <Route path="home" element={<HomeComponent {...data} />} />
              {dynamicRoutes}
            </Route>
          </Routes>
        </AuthProvider>
      </ServicesProvider>
    </HashRouter>
  );
}
