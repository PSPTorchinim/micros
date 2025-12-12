import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import { mapFooterData } from '../utils/footer-mapper';
import type { Footer as FooterType } from '../models/strapi/strapiMap';
import type { NavigationItem } from '../models/strapi/navigation-item';

interface LayoutProps {
  navigation: {
    links: NavigationItem[];
  };
  footer: FooterType | null;
}

export const Layout = (props: LayoutProps) => {
  const mappedFooter = mapFooterData(props.footer);

  return (
    <div className="layout-container">
      <Header {...props.navigation} />
      <main className="layout-main">
        <Outlet />
      </main>
      {mappedFooter && <Footer {...mappedFooter} />}
    </div>
  );
};
