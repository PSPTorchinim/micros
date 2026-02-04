// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore - React is needed for JSX
import React from 'react';
import { Outlet } from 'react-router-dom';
import type { NavigationItem } from '../components/DynamicRoutes';
import { Footer } from '../components/molecules/Footer';
import { Header } from '../components/molecules/Header';
import type { Footer as FooterType } from '../models/api/strapi/apiMap';

interface LayoutProps {
  navigation: {
    links: NavigationItem[];
  };
  footer: FooterType | null;
}

export const Layout = (props: LayoutProps) => {
  return (
    <div className="layout-container">
      <Header {...props.navigation} />
      <main className="layout-main">
        <Outlet />
      </main>
      {props.footer && <Footer footerData={props.footer} />}
    </div>
  );
};
