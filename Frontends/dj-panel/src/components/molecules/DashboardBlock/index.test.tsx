import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardBlock } from './index';
import { AuthContext } from '../../../context/auth-context';
import type { GetUserDTO } from '../../../models/api/identity/apiMap';
import { BrandService, type CompanyData } from '../../../services/brand-service';

// Mock BrandService
jest.mock('../../../services/brand-service');

// Mock user data
const mockUser: GetUserDTO = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
};

// Mock company data
const mockCompanyData: CompanyData = {
  name: 'Test Company',
  address: '123 Test St',
  phone: '555-1234',
};

// Helper to render component with auth context
const renderWithAuth = (user: GetUserDTO | null = null) => {
  const mockAuthContext = {
    user,
    token: user ? 'mock-token' : null,
    refreshToken: user ? 'mock-refresh-token' : null,
    setUser: jest.fn(),
    setToken: jest.fn(),
    setRefreshToken: jest.fn(),
    logout: jest.fn(),
  };

  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <DashboardBlock />
    </AuthContext.Provider>,
  );
};

describe('DashboardBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    (BrandService.getCompany as jest.Mock).mockResolvedValue(mockCompanyData);
    // Mock formatFieldName to return the key as-is for simpler testing
    (BrandService.formatFieldName as jest.Mock) = jest.fn((key: string) => key);
  });

  it('renders with default props when user is authenticated', async () => {
    renderWithAuth(mockUser);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('View all your account and company information in one place.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    expect(screen.getByText('Company Information')).toBeInTheDocument();
  });

  it('displays user profile information', async () => {
    renderWithAuth(mockUser);

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays company information when loaded', async () => {
    renderWithAuth(mockUser);

    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });

    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
  });

  it('shows loading state while fetching company data', () => {
    (BrandService.getCompany as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );
    
    renderWithAuth(mockUser);

    expect(screen.getByText('Loading company information...')).toBeInTheDocument();
  });

  it('shows error message when user is not authenticated', () => {
    renderWithAuth(null);

    expect(
      screen.getByText('No user information available. Please log in.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Profile Information')).not.toBeInTheDocument();
  });

  it('displays N/A for missing user fields', async () => {
    (BrandService.getCompany as jest.Mock).mockResolvedValue(null);
    
    const incompleteUser: GetUserDTO = {
      id: '2',
    };

    renderWithAuth(incompleteUser);

    const values = screen.getAllByText('N/A');
    expect(values.length).toBeGreaterThanOrEqual(2); // At least username and email
  });

  it('handles company data fetch error', async () => {
    (BrandService.getCompany as jest.Mock).mockRejectedValue(
      new Error('Network error'),
    );
    
    renderWithAuth(mockUser);

    await waitFor(() => {
      expect(screen.getByText('Failed to load company information')).toBeInTheDocument();
    });
  });

  it('shows message when no company data is available', async () => {
    (BrandService.getCompany as jest.Mock).mockResolvedValue(null);
    
    renderWithAuth(mockUser);

    await waitFor(() => {
      expect(
        screen.getByText('No company information available'),
      ).toBeInTheDocument();
    });
  });

  it('renders custom labels when provided', async () => {
    const mockAuthContext = {
      user: mockUser,
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      setUser: jest.fn(),
      setToken: jest.fn(),
      setRefreshToken: jest.fn(),
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <DashboardBlock
          title="My Dashboard"
          description="Custom description"
          profileSectionTitle="My Profile"
          companySectionTitle="My Company"
          usernameLabel="User Name"
          emailLabel="Email Address"
        />
      </AuthContext.Provider>,
    );

    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('My Company')).toBeInTheDocument();
    expect(screen.getByText('User Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('applies custom styles when provided', async () => {
    const customStyles = { backgroundColor: 'red' };
    const mockAuthContext = {
      user: mockUser,
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      setUser: jest.fn(),
      setToken: jest.fn(),
      setRefreshToken: jest.fn(),
      logout: jest.fn(),
    };

    const { container } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <DashboardBlock customStyles={customStyles} />
      </AuthContext.Provider>,
    );

    const dashboardContainer = container.querySelector(
      '.dashboard-block-container',
    );
    expect(dashboardContainer).not.toBeNull();
    expect(dashboardContainer).toHaveAttribute('style');
    expect(dashboardContainer?.getAttribute('style')).toContain(
      'background-color',
    );
  });
});

describe('BrandService', () => {
  describe('formatFieldName', () => {
    it('formats camelCase field names correctly', () => {
      // Use the actual implementation from the real service
      const actualBrandService = jest.requireActual('../../../services/brand-service');
      expect(actualBrandService.BrandService.formatFieldName('companyName')).toBe('Company Name');
      expect(actualBrandService.BrandService.formatFieldName('phoneNumber')).toBe('Phone Number');
    });

    it('formats snake_case field names correctly', () => {
      const actualBrandService = jest.requireActual('../../../services/brand-service');
      expect(actualBrandService.BrandService.formatFieldName('company_name')).toBe('Company Name');
      expect(actualBrandService.BrandService.formatFieldName('phone_number')).toBe('Phone Number');
    });

    it('handles single word field names', () => {
      const actualBrandService = jest.requireActual('../../../services/brand-service');
      expect(actualBrandService.BrandService.formatFieldName('name')).toBe('Name');
      expect(actualBrandService.BrandService.formatFieldName('address')).toBe('Address');
    });

    it('handles already formatted names', () => {
      const actualBrandService = jest.requireActual('../../../services/brand-service');
      expect(actualBrandService.BrandService.formatFieldName('Name')).toBe('Name');
    });
  });
});
