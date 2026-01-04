import React from 'react';
import { ServiceContext, Services } from '../context/service-context';
import { UsersService } from '../services/users-service';
import { StrapiService } from '../services/strapi-service';

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const services: Services = {
    usersService: UsersService,
    strapiService: StrapiService,
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};
