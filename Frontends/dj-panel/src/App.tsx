import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { useDynamicRoutes } from './components/DynamicRoutes';
import { NotFoundComponent } from './components/molecules/ErrorPage/NotFound';
import { ThemeProvider } from './context/theme-context';
import { Layout } from './layout';
import { AuthProvider } from './providers/auth-provider';
import { CompanySetupProvider } from './providers/company-setup-provider';
import { ServicesProvider } from './providers/services-provider';

export default function App() {
  const [dynamicRoutes, dynamicNavigation, footerData] = useDynamicRoutes();
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ServicesProvider>
          <AuthProvider>
            <CompanySetupProvider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Layout
                      navigation={{ links: dynamicNavigation }}
                      footer={footerData}
                    />
                  }
                >
                  {dynamicRoutes}
                  <Route path="*" element={<NotFoundComponent />} />
                </Route>
              </Routes>
            </CompanySetupProvider>
          </AuthProvider>
        </ServicesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
