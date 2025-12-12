import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import { mapFooterData } from '../utils/footer-mapper';

export const Layout = (props: any) => {
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
