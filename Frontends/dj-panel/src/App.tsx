import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './providers/auth-provider';
import { ServicesProvider } from './providers/services-provider';
import { Layout } from './components/Layout/Layout';
import { DynamicPage } from './components/DynamicPage';

export default function App() {
  return (
    <HashRouter>
      <ServicesProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/*" element={<DynamicPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ServicesProvider>
    </HashRouter>
  );
}
