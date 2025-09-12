import { createContext } from 'react';
import { UsersService } from '../services/users-service';

type Services = {
  usersService: typeof UsersService;
};

const ServiceContext = createContext<Services | undefined>(undefined);

export type { Services };
export { ServiceContext };
