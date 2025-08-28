import React from 'react';
import { ServiceContext, Services } from '../context/service-context';
import { UsersService } from '../services/users-service';
import { api } from '../utils/api';

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const services: Services = {
    usersService: UsersService,
    api: api,
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};
