import React, { useEffect, useState } from 'react';
import { ContentService } from '../../services/content-service';
import { NavigationBar } from './Navigation/NavigationBar';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [navigationData, setNavigationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const navData = await ContentService.getNavigationData();
        setNavigationData(navData);
      } catch (error) {
        console.error('Failed to load navigation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNavigation();
  }, []);

  if (loading) {
    return <div className="layout-loading">Loading...</div>;
  }

  return (
    <div className="layout">
      <Header logo={navigationData?.logo} />
      <NavigationBar links={navigationData?.links || []} />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};
