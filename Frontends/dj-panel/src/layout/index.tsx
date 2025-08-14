import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';

export const Layout = (props: any) => {
  return (
    <div className="layout-container">
      <Header {...props.navigation} />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer {...props.footer}/>
    </div>
  );
};
