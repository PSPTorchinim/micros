import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LoginComponent } from './pages/identity/login';
import { HomeComponent } from './pages/home';
import { Layout } from './layout';
import './index.css';

import { data } from './content/homePage';
import { navigation } from './content/navigation';
import { footer } from './content/footer';
import { AuthProvider } from './providers/auth-provider';
import { ForgotPasswordComponent } from './pages/identity/forgot-password';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout navigation={navigation} footer={footer} />}>
            <Route path="users">
              <Route path="login" element={<LoginComponent />} />
              <Route path="forgot-password" element={<ForgotPasswordComponent />} />
            </Route>
            <Route index element={<HomeComponent {...data} />} />
          </Route>
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}