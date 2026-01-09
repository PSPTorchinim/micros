import type { Meta, StoryObj } from '@storybook/react';
import { DashboardBlock } from './index';
import { AuthContext } from '../../../context/auth-context';
import type { GetUserDTO } from '../../../models/api/identity/apiMap';
import { BrandService, type CompanyData } from '../../../services/brand-service';

const mockUser: GetUserDTO = {
  id: '1',
  username: 'johndoe',
  email: 'john.doe@example.com',
};

const mockCompanyData: CompanyData = {
  name: 'Acme Corporation',
  address: '123 Business Ave, Suite 100',
  phone: '+1 (555) 123-4567',
  email: 'info@acme.com',
  website: 'https://acme.com',
  industry: 'Technology',
};

// Store original implementation to restore later
const originalGetCompany = BrandService.getCompany;

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
        setUser: () => {},
        setToken: () => {},
        setRefreshToken: () => {},
        logout: () => {},
      };

      // Mock the BrandService for this story
      BrandService.getCompany = async () => mockCompanyData;

      return (
        <AuthContext.Provider value={mockAuthContext}>
          <Story />
        </AuthContext.Provider>
      );
    },
    // Cleanup decorator to restore original implementation
    () => {
      BrandService.getCompany = originalGetCompany;
      return null;
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
        setUser: () => {},
        setToken: () => {},
        setRefreshToken: () => {},
        logout: () => {},
      };

      // Mock empty company data for this story
      BrandService.getCompany = async () => null;

      return (
        <AuthContext.Provider value={mockAuthContext}>
          <Story />
        </AuthContext.Provider>
      );
    },
    // Cleanup decorator
    () => {
      BrandService.getCompany = originalGetCompany;
      return null;
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
        setUser: () => {},
        setToken: () => {},
        setRefreshToken: () => {},
        logout: () => {},
      };

      return (
        <AuthContext.Provider value={mockAuthContext}>
          <Story />
        </AuthContext.Provider>
      );
    },
  ],
};
