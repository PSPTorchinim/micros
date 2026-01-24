import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CompanyBlock } from './index';
import { CompanyService } from '../../../services/company-service';

// Mock environment variables
process.env.REACT_APP_API_SECURE_KEY = 'test-secure-key-for-testing';

// Mock the CompanyService
jest.mock('../../../services/company-service');

// Mock company data
const mockCompanyData = {
  id: '1',
  name: 'Test Company',
  email: 'info@testcompany.com',
  phone: '+1234567890',
  country: 'USA',
  city: 'New York',
  postCode: '10001',
  addressLine1: '123 Test Street',
  addressLine2: 'Suite 100',
  logo: '',
  createdDate: '2024-01-01T00:00:00Z',
};

const mockUsers = [
  {
    id: '1',
    userId: 'user1',
    username: 'John Doe',
    email: 'john@testcompany.com',
    role: 'Admin',
  },
  {
    id: '2',
    userId: 'user2',
    username: 'Jane Smith',
    email: 'jane@testcompany.com',
    role: 'Member',
  },
];

describe('CompanyBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (CompanyService.getCompany as jest.Mock).mockResolvedValue(mockCompanyData);
    (CompanyService.getCompanyUsers as jest.Mock).mockResolvedValue(mockUsers);
    (CompanyService.getCompanyStructure as jest.Mock).mockResolvedValue([]);
  });

  it('renders loading state initially', async () => {
    await act(async () => {
      render(<CompanyBlock />);
    });
    expect(
      screen.getByText('Loading company information...'),
    ).toBeInTheDocument();
  });

  it('renders company information after loading', async () => {
    await act(async () => {
      render(<CompanyBlock />);
    });

    await waitFor(() => {
      expect(screen.getByText('Company Details')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('info@testcompany.com')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  it('renders company users', async () => {
    await act(async () => {
      render(<CompanyBlock />);
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('john@testcompany.com')).toBeInTheDocument();
    expect(screen.getByText('jane@testcompany.com')).toBeInTheDocument();
    expect(screen.getAllByText('Admin')).toHaveLength(1);
    expect(screen.getAllByText('Member')).toHaveLength(1);
  });

  it('renders custom title and description', async () => {
    await act(async () => {
      render(
        <CompanyBlock
          title="Organization Info"
          description="Manage your organization"
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Organization Info')).toBeInTheDocument();
    });

    expect(screen.getByText('Manage your organization')).toBeInTheDocument();
  });

  it('renders custom section titles', async () => {
    await act(async () => {
      render(
        <CompanyBlock
          companyInfoTitle="Org Details"
          usersTitle="Team Members"
          structureTitle="Org Structure"
        />,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Org Details')).toBeInTheDocument();
    });

    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByText('Org Structure')).toBeInTheDocument();
  });

  it('shows message when no company data is available', async () => {
    (CompanyService.getCompany as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      render(<CompanyBlock />);
    });

    await waitFor(() => {
      expect(
        screen.getByText('No company information available.'),
      ).toBeInTheDocument();
    });
  });

  it('shows message when no users are assigned', async () => {
    (CompanyService.getCompanyUsers as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(<CompanyBlock />);
    });

    await waitFor(() => {
      expect(
        screen.getByText('No users assigned to the company.'),
      ).toBeInTheDocument();
    });
  });

  it('shows message when no structure is defined', async () => {
    await act(async () => {
      render(<CompanyBlock />);
    });

    await waitFor(() => {
      expect(
        screen.getByText('No company structure defined.'),
      ).toBeInTheDocument();
    });
  });

  it('applies custom styles', async () => {
    const customStyles = { backgroundColor: 'blue' };

    let container;
    await act(async () => {
      const result = render(<CompanyBlock customStyles={customStyles} />);
      container = result.container;
    });

    await waitFor(() => {
      const companyContainer = container.querySelector(
        '.company-block-container',
      );
      expect(companyContainer).toHaveAttribute('style');
      expect(companyContainer?.getAttribute('style')).toContain(
        'background-color',
      );
    });
  });

  it('calls CompanyService methods on mount', async () => {
    await act(async () => {
      render(<CompanyBlock />);
    });

    await waitFor(() => {
      expect(CompanyService.getCompany).toHaveBeenCalledTimes(1);
      expect(CompanyService.getCompanyUsers).toHaveBeenCalledTimes(1);
      expect(CompanyService.getCompanyStructure).toHaveBeenCalledTimes(1);
    });
  });
});
