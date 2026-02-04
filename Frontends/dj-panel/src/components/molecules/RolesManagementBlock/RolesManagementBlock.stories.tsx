import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import * as PermissionsServiceModule from '../../../services/permissions-service';
import * as RolesServiceModule from '../../../services/roles-service';
import { RolesManagementBlock } from './index';

// Mock data
const mockPermissions = [
  {
    id: '1',
    name: 'user:read',
    description: 'View user information',
  },
  {
    id: '2',
    name: 'user:write',
    description: 'Create and update users',
  },
  {
    id: '3',
    name: 'user:delete',
    description: 'Delete users',
  },
  {
    id: '4',
    name: 'role:read',
    description: 'View roles',
  },
  {
    id: '5',
    name: 'role:write',
    description: 'Create and update roles',
  },
  {
    id: '6',
    name: 'role:delete',
    description: 'Delete roles',
  },
  {
    id: '7',
    name: 'company:read',
    description: 'View company information',
  },
  {
    id: '8',
    name: 'company:write',
    description: 'Update company details',
  },
  {
    id: '9',
    name: 'party:read',
    description: 'View party events',
  },
  {
    id: '10',
    name: 'party:write',
    description: 'Create and update parties',
  },
  {
    id: '11',
    name: 'party:delete',
    description: 'Delete party events',
  },
  {
    id: '12',
    name: 'music:read',
    description: 'Browse music library',
  },
  {
    id: '13',
    name: 'music:write',
    description: 'Add and edit music',
  },
  {
    id: '14',
    name: 'equipment:read',
    description: 'View equipment inventory',
  },
  {
    id: '15',
    name: 'equipment:write',
    description: 'Manage equipment',
  },
];

const mockRoles = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: mockPermissions.slice(0, 15),
    createdDate: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'DJ Manager',
    description: 'Manage parties, music, and equipment',
    permissions: [
      mockPermissions[8], // party:read
      mockPermissions[9], // party:write
      mockPermissions[10], // party:delete
      mockPermissions[11], // music:read
      mockPermissions[12], // music:write
      mockPermissions[13], // equipment:read
      mockPermissions[14], // equipment:write
    ],
    createdDate: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'Event Coordinator',
    description: 'Coordinate events and view resources',
    permissions: [
      mockPermissions[8], // party:read
      mockPermissions[9], // party:write
      mockPermissions[11], // music:read
      mockPermissions[13], // equipment:read
    ],
    createdDate: '2024-02-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Music Librarian',
    description: 'Manage music library only',
    permissions: [
      mockPermissions[11], // music:read
      mockPermissions[12], // music:write
    ],
    createdDate: '2024-02-10T00:00:00Z',
  },
  {
    id: '5',
    name: 'Viewer',
    description: 'Read-only access to most resources',
    permissions: [
      mockPermissions[0], // user:read
      mockPermissions[6], // company:read
      mockPermissions[8], // party:read
      mockPermissions[11], // music:read
      mockPermissions[13], // equipment:read
    ],
    createdDate: '2024-02-15T00:00:00Z',
  },
];

const meta = {
  title: 'Molecules/RolesManagementBlock',
  component: RolesManagementBlock,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any, context: any) => {
      useEffect(() => {
        // Mock the RolesService and PermissionsService methods
        const originalGetRoles = RolesServiceModule.RolesService.getRoles;
        const originalGetRole = RolesServiceModule.RolesService.getRole;
        const originalCreateRole = RolesServiceModule.RolesService.createRole;
        const originalUpdateRole = RolesServiceModule.RolesService.updateRole;
        const originalDeleteRole = RolesServiceModule.RolesService.deleteRole;
        const originalGetPermissions =
          PermissionsServiceModule.PermissionsService.getPermissions;

        // Determine which scenario to use
        const scenario = context.args.scenario ?? 'default';

        if (scenario === 'loading') {
          // Mock loading state - delay the response
          RolesServiceModule.RolesService.getRoles = () =>
            new Promise(() => {
              /* never resolves */
            });
          PermissionsServiceModule.PermissionsService.getPermissions = () =>
            new Promise(() => {
              /* never resolves */
            });
        } else if (scenario === 'error') {
          // Mock error state
          RolesServiceModule.RolesService.getRoles = () =>
            Promise.resolve({
              success: false,
              data: null,
              message: 'Failed to load roles from server',
              errors: ['Network error'],
            });
          PermissionsServiceModule.PermissionsService.getPermissions = () =>
            Promise.resolve({
              success: false,
              data: null,
              message: 'Failed to load permissions',
              errors: ['Network error'],
            });
        } else if (scenario === 'empty') {
          // Mock empty state
          RolesServiceModule.RolesService.getRoles = () =>
            Promise.resolve({
              success: true,
              data: [],
              message: null,
              errors: null,
            });
          PermissionsServiceModule.PermissionsService.getPermissions = () =>
            Promise.resolve({
              success: true,
              data: mockPermissions,
              message: null,
              errors: null,
            });
        } else {
          // Default scenario with data
          RolesServiceModule.RolesService.getRoles = () =>
            Promise.resolve({
              success: true,
              data: mockRoles,
              message: null,
              errors: null,
            });

          RolesServiceModule.RolesService.getRole = (id: string) => {
            const role = mockRoles.find((r) => r.id === id);
            return Promise.resolve({
              success: true,
              data: role,
              message: null,
              errors: null,
            });
          };

          RolesServiceModule.RolesService.createRole = () =>
            Promise.resolve({
              success: true,
              data: true,
              message: 'Role created successfully',
              errors: null,
            });

          RolesServiceModule.RolesService.updateRole = () =>
            Promise.resolve({
              success: true,
              data: true,
              message: 'Role updated successfully',
              errors: null,
            });

          RolesServiceModule.RolesService.deleteRole = () =>
            Promise.resolve({
              success: true,
              data: true,
              message: 'Role deleted successfully',
              errors: null,
            });

          PermissionsServiceModule.PermissionsService.getPermissions = () =>
            Promise.resolve({
              success: true,
              data: mockPermissions,
              message: null,
              errors: null,
            });
        }

        // Cleanup function to restore original methods
        return () => {
          RolesServiceModule.RolesService.getRoles = originalGetRoles;
          RolesServiceModule.RolesService.getRole = originalGetRole;
          RolesServiceModule.RolesService.createRole = originalCreateRole;
          RolesServiceModule.RolesService.updateRole = originalUpdateRole;
          RolesServiceModule.RolesService.deleteRole = originalDeleteRole;
          PermissionsServiceModule.PermissionsService.getPermissions =
            originalGetPermissions;
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
    title: {
      control: 'text',
      description: 'The title of the roles management block',
    },
    description: {
      control: 'text',
      description: 'Description text shown below the title',
    },
    customStyles: {
      control: 'object',
      description: 'Custom CSS styles to apply to the container',
    },
  },
} satisfies Meta<typeof RolesManagementBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing a list of roles with various permission configurations.
 * This demonstrates the main use case with multiple roles.
 */
export const Default: Story = {
  args: {},
};

/**
 * Loading state while fetching roles and permissions from the server.
 */
export const Loading: Story = {
  args: {},
};

/**
 * Error state when the server fails to return data.
 */
export const ErrorState: Story = {
  args: {},
};

/**
 * Empty state when no roles have been created yet.
 * Shows the empty message and encourages creating the first role.
 */
export const Empty: Story = {
  args: {},
};

/**
 * Custom title and description for the roles management interface.
 */
export const CustomLabels: Story = {
  args: {
    title: 'Team Roles & Permissions',
    description:
      'Configure team roles and assign specific permissions to control access levels.',
  },
};

/**
 * Minimal setup with only a few roles.
 */
export const MinimalSetup: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Override with minimal data
        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[0], mockRoles[4]], // Only Admin and Viewer
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Single role scenario - useful for focused testing.
 */
export const SingleRole: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Override with single role
        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[1]], // Only DJ Manager
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
    title: 'Access Control',
    description: 'Manage user roles and their permissions',
    customStyles: {
      backgroundColor: '#f5f5f5',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
  },
};

/**
 * Demonstration of role with all permissions assigned (Administrator).
 */
export const RoleWithAllPermissions: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Show only the Administrator role
        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[0]], // Administrator with all permissions
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Demonstration of role with minimal permissions (Viewer).
 */
export const RoleWithMinimalPermissions: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Show only the Viewer role
        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[4]], // Viewer with read-only permissions
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Large permission set to test scrolling and grouping functionality.
 */
export const LargePermissionSet: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Add more permissions to test UI with large dataset
        const extraPermissions = [
          { id: '16', name: 'document:read', description: 'View documents' },
          { id: '17', name: 'document:write', description: 'Edit documents' },
          {
            id: '18',
            name: 'document:delete',
            description: 'Delete documents',
          },
          { id: '19', name: 'mailing:read', description: 'View mailings' },
          { id: '20', name: 'mailing:send', description: 'Send emails' },
          { id: '21', name: 'report:read', description: 'View reports' },
          {
            id: '22',
            name: 'report:generate',
            description: 'Generate reports',
          },
          { id: '23', name: 'settings:read', description: 'View settings' },
          { id: '24', name: 'settings:write', description: 'Change settings' },
          { id: '25', name: 'audit:read', description: 'View audit logs' },
        ];

        PermissionsServiceModule.PermissionsService.getPermissions = () =>
          Promise.resolve({
            success: true,
            data: [...mockPermissions, ...extraPermissions],
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Permission grouping by category - demonstrates how permissions are organized.
 */
export const PermissionGrouping: Story = {
  args: {
    title: 'Permission Categories',
    description:
      'Permissions are automatically grouped by their prefix (e.g., user:*, party:*, music:*)',
  },
};

/**
 * Create role workflow - demonstrates the role creation form.
 */
export const CreateRoleWorkflow: Story = {
  args: {
    title: 'Create New Role',
    description: 'Click "Create New Role" to see the role creation form',
  },
  play: async () => {
    // This play function can be used for interaction testing
    // Note: Requires @storybook/testing-library and user-event
    // Example: const canvas = within(canvasElement);
    // await userEvent.click(canvas.getByRole('button', { name: /create/i }));
  },
};

/**
 * Edit role workflow - shows how to edit an existing role.
 */
export const EditRoleWorkflow: Story = {
  args: {
    title: 'Edit Existing Role',
    description: 'Click "Edit" on any role to modify its permissions',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Show only one role for focused editing demo
        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[1]], // DJ Manager
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Role with no permissions - edge case testing.
 */
export const RoleWithNoPermissions: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        const emptyRole = {
          id: '99',
          name: 'Guest',
          description: 'Limited guest access with no permissions',
          permissions: [],
          createdDate: '2024-02-20T00:00:00Z',
        };

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [emptyRole],
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Delete role operation - demonstrates deletion workflow.
 */
export const DeleteRoleOperation: Story = {
  args: {
    title: 'Delete Role',
    description:
      'Click "Delete" on a role to remove it (confirmation dialog will appear)',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Show roles that can be deleted
        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[3], mockRoles[4]], // Music Librarian and Viewer
            message: null,
            errors: null,
          });

        RolesServiceModule.RolesService.deleteRole = () =>
          Promise.resolve({
            success: true,
            data: true,
            message: 'Role deleted successfully',
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Permission matrix view - shows multiple roles with their permission sets.
 */
export const PermissionMatrix: Story = {
  args: {
    title: 'Permission Matrix',
    description: 'Compare permissions across different roles',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Show a good variety of roles for comparison
        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[0], mockRoles[1], mockRoles[3], mockRoles[4]],
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Server error during role creation - error handling demonstration.
 */
export const CreateRoleError: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        // Mock successful data fetch but failed creation
        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: mockRoles,
            message: null,
            errors: null,
          });

        RolesServiceModule.RolesService.createRole = () =>
          Promise.resolve({
            success: false,
            data: false,
            message: 'Role name already exists',
            errors: ['Duplicate role name'],
          });

        PermissionsServiceModule.PermissionsService.getPermissions = () =>
          Promise.resolve({
            success: true,
            data: mockPermissions,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Server error during role update - error handling for edit operations.
 */
export const UpdateRoleError: Story = {
  args: {},
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: [mockRoles[1]], // DJ Manager
            message: null,
            errors: null,
          });

        RolesServiceModule.RolesService.getRole = () =>
          Promise.resolve({
            success: true,
            data: mockRoles[1],
            message: null,
            errors: null,
          });

        RolesServiceModule.RolesService.updateRole = () =>
          Promise.resolve({
            success: false,
            data: false,
            message: 'Failed to update role',
            errors: ['Database connection error'],
          });

        PermissionsServiceModule.PermissionsService.getPermissions = () =>
          Promise.resolve({
            success: true,
            data: mockPermissions,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};

/**
 * Specialized roles for different business needs.
 */
export const SpecializedRoles: Story = {
  args: {
    title: 'Specialized Role Templates',
    description: 'Pre-configured roles for common business scenarios',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      useEffect(() => {
        const specializedRoles = [
          {
            id: '10',
            name: 'Party Planner',
            description: 'Full control over party events and coordination',
            permissions: [
              mockPermissions[8], // party:read
              mockPermissions[9], // party:write
              mockPermissions[10], // party:delete
              mockPermissions[11], // music:read
            ],
            createdDate: '2024-02-15T00:00:00Z',
          },
          {
            id: '11',
            name: 'Equipment Manager',
            description: 'Manage all equipment and inventory',
            permissions: [
              mockPermissions[13], // equipment:read
              mockPermissions[14], // equipment:write
            ],
            createdDate: '2024-02-15T00:00:00Z',
          },
          {
            id: '12',
            name: 'Client Liaison',
            description: 'Interface with clients and manage communications',
            permissions: [
              mockPermissions[6], // company:read
              mockPermissions[7], // company:write
              mockPermissions[8], // party:read
            ],
            createdDate: '2024-02-15T00:00:00Z',
          },
        ];

        RolesServiceModule.RolesService.getRoles = () =>
          Promise.resolve({
            success: true,
            data: specializedRoles,
            message: null,
            errors: null,
          });
      }, []);

      return <Story />;
    },
  ],
};
