import { createContext } from 'react';
import { UsersService } from '../services/users-service';
import { StrapiService } from '../services/strapi-service';

type Services = {
  usersService: typeof UsersService;
  strapiService: typeof StrapiService;
};

const ServiceContext = createContext<Services | undefined>(undefined);

export type { Services };
export { ServiceContext };
