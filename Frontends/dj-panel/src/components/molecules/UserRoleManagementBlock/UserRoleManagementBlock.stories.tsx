import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import * as RolesServiceModule from '../../../services/roles-service';
import * as UserRoleManagementServiceModule from '../../../services/user-role-management-service';
import { UserRoleManagementBlock } from './index';

// Mock data for roles
const mockRoles = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: [],
    createdDate: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'DJ Manager',
    description: 'Manage parties, music, and equipment',
    permissions: [],
    createdDate: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'Event Coordinator',
    description: 'Coordinate events and view resources',
    permissions: [],
    createdDate: '2024-02-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access to most resources',
    permissions: [],
    createdDate: '2024-02-15T00:00:00Z',
  },
];

// Mock data for users with role assignments
const mockUsers = [
  {
    userId: '1',
    userEmail: 'admin@djbeatblaster.com',
    isActive: true,
    assignedRoles: [
      {
        roleId: '1',
        roleName: 'Administrator',
        roleDetails: 'Full system access',
      },
    ],
    accountCreationDate: '2024-01-10T00:00:00Z',
  },
  {
    userId: '2',
    userEmail: 'dj.mike@djbeatblaster.com',
    isActive: true,
    assignedRoles: [
      {
        roleId: '2',
        roleName: 'DJ Manager',
        roleDetails: 'Manage parties and music',
      },
      {
        roleId: '3',
        roleName: 'Event Coordinator',
        roleDetails: 'Coordinate events',
      },
    ],
    accountCreationDate: '2024-01-15T00:00:00Z',
  },
  {
    userId: '3',
    userEmail: 'sarah.events@djbeatblaster.com',
    isActive: true,
    assignedRoles: [
      {
        roleId: '3',
        roleName: 'Event Coordinator',
        roleDetails: 'Coordinate events',
      },
    ],
    accountCreationDate: '2024-01-20T00:00:00Z',
  },
  {
    userId: '4',
    userEmail: 'guest@djbeatblaster.com',
    isActive: false,
    assignedRoles: [
      {
        roleId: '4',
        roleName: 'Viewer',
        roleDetails: 'Read-only access',
      },
    ],
    accountCreationDate: '2024-02-01T00:00:00Z',
  },
  {
    userId: '5',
    userEmail: 'newuser@djbeatblaster.com',
    isActive: true,
    assignedRoles: [],
    accountCreationDate: '2024-02-20T00:00:00Z',
  },
];

const meta = {
  title: 'Molecules/UserRoleManagementBlock',
  component: UserRoleManagementBlock,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any, context: any) => {
      useEffect(() => {
        // Store original methods
        const originalFetchAllUsersWithRoles =
          UserRoleManagementServiceModule.UserRoleManagementService
            .fetchAllUsersWithRoles;
        const originalModifyUserRoleAssignments =
          UserRoleManagementServiceModule.UserRoleManagementService
            .modifyUserRoleAssignments;
        const originalGetRoles = RolesServiceModule.RolesService.getRoles;

        // Determine which scenario to use
        const scenario = context.args.scenario ?? 'default';

        if (scenario === 'loading') {
          // Mock loading state - delay the response
          UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
            () =>
              new Promise(() => {
                /* never resolves */
              });
          RolesServiceModule.RolesService.getRoles = () =>
            new Promise(() => {
              /* never resolves */
            });
        } else if (scenario === 'error') {
          // Mock error state
          UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
            () =>
              Promise.resolve({
                isSuccessful: false,
                users: null,
                errorMessage: 'Failed to load users from server',
                validationErrors: ['Network connection error'],
              });
          RolesServiceModule.RolesService.getRoles = () =>
            Promise.resolve({
              success: false,
              data: null,
              message: 'Failed to load roles',
              errors: ['Network error'],
            });
        } else if (scenario === 'empty') {
          // Mock empty state
          UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
            () =>
              Promise.resolve({
                isSuccessful: true,
                users: [],
                errorMessage: null,
                validationErrors: null,
              });
          RolesServiceModule.RolesService.getRoles = () =>
            Promise.resolve({
              success: true,
              data: mockRoles,
              message: null,
              errors: null,
            });
        } else {
          // Default scenario with data
          UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
            () =>
              Promise.resolve({
                isSuccessful: true,
                users: mockUsers,
                errorMessage: null,
                validationErrors: null,
              });

          UserRoleManagementServiceModule.UserRoleManagementService.modifyUserRoleAssignments =
            () =>
              Promise.resolve({
                success: true,
                data: true,
                message: 'User roles updated successfully',
                errors: null,
              });

          RolesServiceModule.RolesService.getRoles = () =>
            Promise.resolve({
              success: true,
              data: mockRoles,
              message: null,
              errors: null,
            });
        }

        // Cleanup function to restore original methods
        return () => {
          UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
            originalFetchAllUsersWithRoles;
          UserRoleManagementServiceModule.UserRoleManagementService.modifyUserRoleAssignments =
            originalModifyUserRoleAssignments;
          RolesServiceModule.RolesService.getRoles = originalGetRoles;
        };
      }, [context.args.scenario]);

      return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
  argTypes: {
    headerText: {
      control: 'text',
      description: 'The header text for the user role management block',
    },
    descriptionText: {
      control: 'text',
      description: 'Description text shown below the header',
    },
    styleOverrides: {
      control: 'object',
      description: 'Custom CSS styles to apply to the container',
    },
  },
} satisfies Meta<typeof UserRoleManagementBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing a list of users with their role assignments.
 * This demonstrates the main use case with multiple users having different roles.
 */
export const Default: Story = {
  args: {},
};

/**
 * Loading state while fetching users and roles from the server.
 */
export const Loading: Story = {
  args: {
    scenario: 'loading',
  },
};

/**
 * Error state when the server fails to return data.
 */
export const ErrorState: Story = {
  args: {
    scenario: 'error',
  },
};

/**
 * Empty state when no users exist in the system.
 * Shows the empty message.
 */
export const Empty: Story = {
  args: {
    scenario: 'empty',
  },
};

/**
 * Custom header and description for the user role management interface.
 */
export const CustomLabels: Story = {
  args: {
    headerText: 'Team Member Access Control',
    descriptionText:
      'Manage user access by assigning or removing roles for team members.',
  },
};

/**
 * Shows users with active and inactive accounts.
 */
export const MixedAccountStatus: Story = {
  args: {},
};

/**
 * Demonstrates user without any assigned roles.
 */
export const UserWithNoRoles: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        const singleUserNoRoles = [mockUsers[4]]; // newuser with no roles

        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: singleUserNoRoles,
              errorMessage: null,
              validationErrors: null,
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: mockRoles,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * User with multiple role assignments.
 */
export const UserWithMultipleRoles: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        const userWithMultipleRoles = [mockUsers[1]]; // DJ Mike with 2 roles

        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: userWithMultipleRoles,
              errorMessage: null,
              validationErrors: null,
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: mockRoles,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Shows only inactive users in the system.
 */
export const InactiveUsersOnly: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        const inactiveUsers = [mockUsers[3]]; // Guest user (inactive)

        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: inactiveUsers,
              errorMessage: null,
              validationErrors: null,
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: mockRoles,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Custom styling applied to the container.
 */
export const CustomStyling: Story = {
  args: {
    headerText: 'User Access Management',
    descriptionText: 'Control user permissions through role assignments',
    styleOverrides: {
      backgroundColor: '#f9f9f9',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
  },
};

/**
 * Large user list to test scrolling and performance.
 */
export const LargeUserList: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Generate a larger list of users
        const largeUserList = Array.from({ length: 20 }, (_, i) => ({
          userId: `user-${i + 1}`,
          userEmail: `user${i + 1}@djbeatblaster.com`,
          isActive: i % 3 !== 0, // Every third user is inactive
          assignedRoles:
            i % 4 === 0
              ? [] // Every fourth user has no roles
              : [
                  {
                    roleId: mockRoles[i % mockRoles.length].id ?? '',
                    roleName: mockRoles[i % mockRoles.length].name,
                    roleDetails:
                      mockRoles[i % mockRoles.length].description ?? '',
                  },
                ],
          accountCreationDate: `2024-02-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
        }));

        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: largeUserList,
              errorMessage: null,
              validationErrors: null,
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: mockRoles,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Error during role assignment update operation.
 */
export const UpdateRoleError: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: mockUsers,
              errorMessage: null,
              validationErrors: null,
            });

        UserRoleManagementServiceModule.UserRoleManagementService.modifyUserRoleAssignments =
          () =>
            Promise.resolve({
              success: false,
              data: false,
              message: 'Failed to update user roles',
              errors: ['Database connection error', 'Permission denied'],
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: mockRoles,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Limited role options available for assignment.
 */
export const LimitedRoleOptions: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: [mockUsers[0], mockUsers[1]],
              errorMessage: null,
              validationErrors: null,
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[0], mockRoles[3]], // Only Admin and Viewer
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Single user scenario - focused view for testing.
 */
export const SingleUser: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: [mockUsers[0]], // Only admin user
              errorMessage: null,
              validationErrors: null,
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: mockRoles,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Demonstrates the edit workflow - shows how to manage a user's roles.
 */
export const EditWorkflow: Story = {
  args: {
    headerText: 'Manage User Roles',
    descriptionText:
      'Click "Manage Roles" on any user to assign or remove their role assignments',
  },
};

/**
 * Administrator-only scenario.
 */
export const AdminOnly: Story = {
  args: {
    headerText: 'Administrator Management',
    descriptionText: 'Manage administrator access for the system',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        const adminUsers = [mockUsers[0]];

        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: adminUsers,
              errorMessage: null,
              validationErrors: null,
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[0]], // Only Administrator role
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Shows user accounts with varied email formats.
 */
export const VariedEmailFormats: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        const variedUsers = [
          {
            ...mockUsers[0],
            userEmail: 'admin@company.com',
          },
          {
            ...mockUsers[1],
            userEmail: 'dj.mike.johnson+test@djbeatblaster.co.uk',
          },
          {
            ...mockUsers[2],
            userEmail: 'sarah_events@subdomain.djbeatblaster.com',
          },
        ];

        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: variedUsers,
              errorMessage: null,
              validationErrors: null,
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: mockRoles,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * All users without roles - demonstrates bulk assignment scenario.
 */
export const AllUsersWithoutRoles: Story = {
  args: {
    headerText: 'Initial Role Assignment',
    descriptionText: 'Assign initial roles to new users',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        const usersWithoutRoles = mockUsers.map((user) => ({
          ...user,
          assignedRoles: [],
        }));

        UserRoleManagementServiceModule.UserRoleManagementService.fetchAllUsersWithRoles =
          () =>
            Promise.resolve({
              isSuccessful: true,
              users: usersWithoutRoles,
              errorMessage: null,
              validationErrors: null,
            });

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: mockRoles,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};
