import type { Meta, StoryObj } from '@storybook/react';
import { DashboardBlock } from './index';
import { AuthContext } from '../../../context/auth-context';
import type { GetUserDTO } from '../../../models/api/identity/apiMap';
import { BrandService } from '../../../services/brand-service';

// Mock the BrandService for Storybook
jest.mock('../../../services/brand-service');

const mockUser: GetUserDTO = {
  id: '1',
  username: 'johndoe',
  email: 'john.doe@example.com',
};

const mockCompanyData = {
  name: 'Acme Corporation',
  address: '123 Business Ave, Suite 100',
  phone: '+1 (555) 123-4567',
  industry: 'Technology',
};

const meta = {
  title: 'Molecules/DashboardBlock',
  component: DashboardBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const mockAuthContext = {
        user: mockUser,
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        setUser: jest.fn(),
        setToken: jest.fn(),
        setRefreshToken: jest.fn(),
        logout: jest.fn(),
      };

      // Mock the company data fetch
      (BrandService.getCompany as jest.Mock).mockResolvedValue(mockCompanyData);

      return (
        <AuthContext.Provider value={mockAuthContext}>
          <Story />
        </AuthContext.Provider>
      );
    },
  ],
} satisfies Meta<typeof DashboardBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomLabels: Story = {
  args: {
    title: 'My Dashboard',
    description: 'All your important information at a glance',
    profileSectionTitle: 'User Profile',
    companySectionTitle: 'Organization Details',
    usernameLabel: 'User Name',
    emailLabel: 'Email Address',
  },
};

export const NoCompanyData: Story = {
  decorators: [
    (Story) => {
      const mockAuthContext = {
        user: mockUser,
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        setUser: jest.fn(),
        setToken: jest.fn(),
        setRefreshToken: jest.fn(),
        logout: jest.fn(),
      };

      // Mock empty company data
      (BrandService.getCompany as jest.Mock).mockResolvedValue(null);

      return (
        <AuthContext.Provider value={mockAuthContext}>
          <Story />
        </AuthContext.Provider>
      );
    },
  ],
};

export const NotAuthenticated: Story = {
  decorators: [
    (Story) => {
      const mockAuthContext = {
        user: null,
        token: null,
        refreshToken: null,
        setUser: jest.fn(),
        setToken: jest.fn(),
        setRefreshToken: jest.fn(),
        logout: jest.fn(),
      };

      return (
        <AuthContext.Provider value={mockAuthContext}>
          <Story />
        </AuthContext.Provider>
      );
    },
  ],
};
