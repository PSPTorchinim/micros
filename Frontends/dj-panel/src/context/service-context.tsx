import { createContext } from 'react';
import { UsersService } from '../services/users-service';
import { ContentService } from '../services/content-service';

type Services = {
  usersService: typeof UsersService;
  contentService: typeof ContentService;
};

const ServiceContext = createContext<Services | undefined>(undefined);

export type { Services };
export { ServiceContext };
