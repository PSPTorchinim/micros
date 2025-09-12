import { createContext } from 'react';
import { UsersService } from '../services/users-service';
import { api } from '../utils/api';

type Services = {
  usersService: typeof UsersService;
  api: typeof api;
};

const ServiceContext = createContext<Services | undefined>(undefined);

export type { Services };
export { ServiceContext };
