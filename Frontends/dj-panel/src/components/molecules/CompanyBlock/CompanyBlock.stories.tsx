import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import * as CompanyServiceModule from '../../../services/company-service';
import { CompanyBlock } from './index';

// Mock data
const mockCompanyData = {
  id: '1',
  name: 'Acme Corporation',
  email: 'contact@acmecorp.com',
  phone: '+1 (555) 123-4567',
  country: 'United States',
  city: 'San Francisco',
  postCode: '94105',
  addressLine1: '123 Market Street',
  addressLine2: 'Suite 500',
  logo: '',
  createdDate: '2024-01-15T00:00:00Z',
};

const mockUsers = [
  {
    id: '1',
    userId: 'user-1',
    username: 'John Smith',
    email: 'john.smith@acmecorp.com',
    role: 'Admin',
  },
  {
    id: '2',
    userId: 'user-2',
    username: 'Jane Doe',
    email: 'jane.doe@acmecorp.com',
    role: 'Manager',
  },
  {
    id: '3',
    userId: 'user-3',
    username: 'Bob Johnson',
    email: 'bob.johnson@acmecorp.com',
    role: 'Member',
  },
];

const mockStructure = [
  {
    id: '1',
    name: 'Engineering',
    type: 'Department',
    parentId: undefined,
    children: [
      {
        id: '2',
        name: 'Frontend Team',
        type: 'Team',
        parentId: '1',
        children: [],
      },
      {
        id: '3',
        name: 'Backend Team',
        type: 'Team',
        parentId: '1',
        children: [],
      },
    ],
  },
];

const meta = {
  title: 'Molecules/CompanyBlock',
  component: CompanyBlock,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        // Mock the CompanyService methods for all stories
        const originalGetCompany =
          CompanyServiceModule.CompanyService.getCompany;
        const originalGetCompanyUsers =
          CompanyServiceModule.CompanyService.getCompanyUsers;
        const originalGetCompanyStructure =
          CompanyServiceModule.CompanyService.getCompanyStructure;
        const originalUpdateCompany =
          CompanyServiceModule.CompanyService.updateCompany;
        const originalAddCompanyUser =
          CompanyServiceModule.CompanyService.addCompanyUser;
        const originalRemoveCompanyUser =
          CompanyServiceModule.CompanyService.removeCompanyUser;

        CompanyServiceModule.CompanyService.getCompany = () =>
          Promise.resolve(mockCompanyData);
        CompanyServiceModule.CompanyService.getCompanyUsers = () =>
          Promise.resolve(mockUsers);
        CompanyServiceModule.CompanyService.getCompanyStructure = () =>
          Promise.resolve(mockStructure);
        CompanyServiceModule.CompanyService.updateCompany = () =>
          Promise.resolve(true);
        CompanyServiceModule.CompanyService.addCompanyUser = () =>
          Promise.resolve(true);
        CompanyServiceModule.CompanyService.removeCompanyUser = () =>
          Promise.resolve(true);

        return () => {
          // Restore original methods on cleanup
          CompanyServiceModule.CompanyService.getCompany = originalGetCompany;
          CompanyServiceModule.CompanyService.getCompanyUsers =
            originalGetCompanyUsers;
          CompanyServiceModule.CompanyService.getCompanyStructure =
            originalGetCompanyStructure;
          CompanyServiceModule.CompanyService.updateCompany =
            originalUpdateCompany;
          CompanyServiceModule.CompanyService.addCompanyUser =
            originalAddCompanyUser;
          CompanyServiceModule.CompanyService.removeCompanyUser =
            originalRemoveCompanyUser;
        };
      }, []);

      return <Story />;
    },
  ],
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title of the company block',
    },
    description: {
      control: 'text',
      description: 'Description text shown below the title',
    },
    companyInfoTitle: {
      control: 'text',
      description: 'Title for the company information section',
    },
    usersTitle: {
      control: 'text',
      description: 'Title for the users management section',
    },
    structureTitle: {
      control: 'text',
      description: 'Title for the company structure section',
    },
    editButtonText: {
      control: 'text',
      description: 'Text for the edit button',
    },
    saveButtonText: {
      control: 'text',
      description: 'Text for the save button',
    },
    cancelButtonText: {
      control: 'text',
      description: 'Text for the cancel button',
    },
    addUserButtonText: {
      control: 'text',
      description: 'Text for the add user button',
    },
    removeUserButtonText: {
      control: 'text',
      description: 'Text for the remove user button',
    },
    customStyles: {
      control: 'object',
      description: 'Custom CSS styles to apply to the container',
    },
  },
} satisfies Meta<typeof CompanyBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomTitles: Story = {
  args: {
    title: 'Organization Management',
    description: 'Manage your organization details and team members.',
    companyInfoTitle: 'Organization Details',
    usersTitle: 'Team Members',
    structureTitle: 'Organizational Structure',
  },
};

export const CustomButtonLabels: Story = {
  args: {
    editButtonText: 'Modify',
    saveButtonText: 'Update',
    cancelButtonText: 'Discard',
    addUserButtonText: 'Invite User',
    removeUserButtonText: 'Delete',
  },
};

export const EmptyState: Story = {
  args: {},
  decorators: [
    (Story) => {
      useEffect(() => {
        // Override with empty data
        const originalGetCompany =
          CompanyServiceModule.CompanyService.getCompany;
        const originalGetCompanyUsers =
          CompanyServiceModule.CompanyService.getCompanyUsers;
        const originalGetCompanyStructure =
          CompanyServiceModule.CompanyService.getCompanyStructure;

        CompanyServiceModule.CompanyService.getCompany = () =>
          Promise.resolve(null);
        CompanyServiceModule.CompanyService.getCompanyUsers = () =>
          Promise.resolve([]);
        CompanyServiceModule.CompanyService.getCompanyStructure = () =>
          Promise.resolve([]);

        return () => {
          CompanyServiceModule.CompanyService.getCompany = originalGetCompany;
          CompanyServiceModule.CompanyService.getCompanyUsers =
            originalGetCompanyUsers;
          CompanyServiceModule.CompanyService.getCompanyStructure =
            originalGetCompanyStructure;
        };
      }, []);

      return <Story />;
    },
  ],
};

export const MinimalCompanyInfo: Story = {
  args: {},
  decorators: [
    (Story) => {
      useEffect(() => {
        // Mock minimal company data
        const minimalCompany = {
          id: '1',
          name: 'Small Startup Inc.',
          email: 'hello@startup.com',
          phone: '+1-555-0123',
          country: 'USA',
          city: 'Austin',
          postCode: '78701',
          addressLine1: '456 Startup Lane',
          addressLine2: '',
          logo: '',
          createdDate: '2025-01-01T00:00:00Z',
        };

        const minimalUsers = [
          {
            id: '1',
            userId: 'founder-1',
            username: 'Sarah Founder',
            email: 'sarah@startup.com',
            role: 'Founder',
          },
        ];

        const originalGetCompany =
          CompanyServiceModule.CompanyService.getCompany;
        const originalGetCompanyUsers =
          CompanyServiceModule.CompanyService.getCompanyUsers;

        CompanyServiceModule.CompanyService.getCompany = () =>
          Promise.resolve(minimalCompany);
        CompanyServiceModule.CompanyService.getCompanyUsers = () =>
          Promise.resolve(minimalUsers);

        return () => {
          CompanyServiceModule.CompanyService.getCompany = originalGetCompany;
          CompanyServiceModule.CompanyService.getCompanyUsers =
            originalGetCompanyUsers;
        };
      }, []);

      return <Story />;
    },
  ],
};

export const LargeTeam: Story = {
  args: {},
  decorators: [
    (Story) => {
      useEffect(() => {
        // Mock a large team
        const largeTeam = Array.from({ length: 10 }, (_, i) => ({
          id: `user-${i + 1}`,
          userId: `uid-${i + 1}`,
          username: `Team Member ${i + 1}`,
          email: `member${i + 1}@acmecorp.com`,
          role: i === 0 ? 'Admin' : i < 3 ? 'Manager' : 'Member',
        }));

        const originalGetCompanyUsers =
          CompanyServiceModule.CompanyService.getCompanyUsers;
        CompanyServiceModule.CompanyService.getCompanyUsers = () =>
          Promise.resolve(largeTeam);

        return () => {
          CompanyServiceModule.CompanyService.getCompanyUsers =
            originalGetCompanyUsers;
        };
      }, []);

      return <Story />;
    },
  ],
};

export const FullyCustomized: Story = {
  args: {
    title: 'Company Settings',
    description:
      'Configure your company profile, manage team access, and view organizational hierarchy.',
    companyInfoTitle: 'Company Profile',
    usersTitle: 'Access Management',
    structureTitle: 'Hierarchy View',
    editButtonText: 'Edit Details',
    saveButtonText: 'Save Changes',
    cancelButtonText: 'Cancel Edit',
    addUserButtonText: 'Add New User',
    removeUserButtonText: 'Remove Access',
  },
};
