import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { PermissionsService } from '../../../services/permissions-service';
import { RolesService } from '../../../services/roles-service';
import { RolesManagementBlock } from './index';

// Mock the services
jest.mock('../../../services/roles-service');
jest.mock('../../../services/permissions-service');

// Mock window.confirm
global.confirm = jest.fn();

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
    name: 'role:read',
    description: 'View roles',
  },
  {
    id: '4',
    name: 'role:write',
    description: 'Create and update roles',
  },
];

const mockRoles = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access',
    permissions: mockPermissions,
    createdDate: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: [mockPermissions[0], mockPermissions[2]],
    createdDate: '2024-01-02T00:00:00Z',
  },
];

describe('RolesManagementBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.confirm as jest.Mock).mockReturnValue(false);

    // Default successful mocks
    (RolesService.getRoles as jest.Mock).mockResolvedValue({
      success: true,
      data: mockRoles,
      message: null,
      errors: null,
    });

    (PermissionsService.getPermissions as jest.Mock).mockResolvedValue({
      success: true,
      data: mockPermissions,
      message: null,
      errors: null,
    });
  });

  describe('Rendering', () => {
    it('renders loading state initially', () => {
      render(<RolesManagementBlock />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with default title and description', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        expect(screen.getByText('Roles Management')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Manage roles and their permissions.'),
      ).toBeInTheDocument();
    });

    it('renders with custom title and description', async () => {
      act(() => {
        render(
          <RolesManagementBlock
            title="Team Roles"
            description="Configure team permissions"
          />,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Team Roles')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Configure team permissions'),
      ).toBeInTheDocument();
    });

    it('renders roles table after loading', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        expect(screen.getByText('Administrator')).toBeInTheDocument();
      });

      expect(screen.getByText('Viewer')).toBeInTheDocument();
      expect(screen.getByText('Full system access')).toBeInTheDocument();
      expect(screen.getByText('Read-only access')).toBeInTheDocument();
    });

    it('displays correct permission counts', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        expect(screen.getByText('4 permissions')).toBeInTheDocument();
      });

      expect(screen.getByText('2 permissions')).toBeInTheDocument();
    });

    it('renders Create New Role button', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        expect(screen.getByText('Create New Role')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error when roles fail to load', async () => {
      (RolesService.getRoles as jest.Mock).mockResolvedValue({
        success: false,
        data: null,
        message: 'Failed to load roles',
        errors: ['Network error'],
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Failed to load roles',
        );
      });
    });

    it('displays error when permissions fail to load', async () => {
      (PermissionsService.getPermissions as jest.Mock).mockResolvedValue({
        success: false,
        data: null,
        message: 'Failed to load permissions',
        errors: ['Permission error'],
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Failed to load permissions',
        );
      });
    });

    it('combines error messages when both services fail', async () => {
      (RolesService.getRoles as jest.Mock).mockResolvedValue({
        success: false,
        data: null,
        message: 'Roles error',
        errors: [],
      });

      (PermissionsService.getPermissions as jest.Mock).mockResolvedValue({
        success: false,
        data: null,
        message: 'Permissions error',
        errors: [],
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Roles error');
        expect(alert).toHaveTextContent('Permissions error');
      });
    });

    it('handles exception during data loading', async () => {
      (RolesService.getRoles as jest.Mock).mockRejectedValue(
        new Error('Network failure'),
      );

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network failure');
      });
    });
  });

  describe('Empty State', () => {
    it('displays empty message when no roles exist', async () => {
      (RolesService.getRoles as jest.Mock).mockResolvedValue({
        success: true,
        data: [],
        message: null,
        errors: null,
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            'No roles found. Create your first role to get started.',
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Create Role', () => {
    it('shows create form when Create New Role is clicked', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        expect(screen.getByText('Create New Role')).toBeInTheDocument();
      });

      const createButton = screen.getByText('Create New Role');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Create New Role')).toBeInTheDocument();
        expect(screen.getByLabelText('Role Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByText('Permissions')).toBeInTheDocument();
      });
    });

    it('displays all permissions grouped by category in create form', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Create New Role'));
      });

      await waitFor(() => {
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Role')).toBeInTheDocument();
        expect(screen.getByText('user:read')).toBeInTheDocument();
        expect(screen.getByText('role:write')).toBeInTheDocument();
      });
    });

    it('creates a new role successfully', async () => {
      (RolesService.createRole as jest.Mock).mockResolvedValue({
        success: true,
        data: true,
        message: 'Role created successfully',
        errors: null,
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Create New Role'));
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText('Role Name');
        const descInput = screen.getByLabelText('Description');

        fireEvent.change(nameInput, { target: { value: 'New Role' } });
        fireEvent.change(descInput, { target: { value: 'Test description' } });
      });

      const saveButton = screen.getByText('Save Role');
      act(() => {
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(RolesService.createRole).toHaveBeenCalledWith({
          name: 'New Role',
          description: 'Test description',
          permissions: [],
        });
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Role created successfully',
        );
      });
    });

    it('shows error message when role creation fails', async () => {
      (RolesService.createRole as jest.Mock).mockResolvedValue({
        success: false,
        data: false,
        message: 'Role name already exists',
        errors: ['Duplicate name'],
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Create New Role'));
      });

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Role Name'), {
          target: { value: 'Admin' },
        });
      });

      act(() => {
        fireEvent.click(screen.getByText('Save Role'));
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Role name already exists',
        );
      });
    });

    it('cancels create form', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Create New Role'));
      });

      await waitFor(() => {
        expect(screen.getByText('Create New Role')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.getByText('Administrator')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Role', () => {
    it('loads role data when edit button is clicked', async () => {
      (RolesService.getRole as jest.Mock).mockResolvedValue({
        success: true,
        data: mockRoles[0],
        message: null,
        errors: null,
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(RolesService.getRole).toHaveBeenCalledWith('1');
        expect(screen.getByText('Edit Role')).toBeInTheDocument();
      });
    });

    it('populates form with existing role data', async () => {
      (RolesService.getRole as jest.Mock).mockResolvedValue({
        success: true,
        data: mockRoles[0],
        message: null,
        errors: null,
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Role Name')).toHaveValue('Administrator');
        expect(screen.getByLabelText('Description')).toHaveValue(
          'Full system access',
        );
      });
    });

    it('updates role successfully', async () => {
      (RolesService.getRole as jest.Mock).mockResolvedValue({
        success: true,
        data: mockRoles[1],
        message: null,
        errors: null,
      });

      (RolesService.updateRole as jest.Mock).mockResolvedValue({
        success: true,
        data: true,
        message: 'Role updated successfully',
        errors: null,
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[1]);
      });

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Description'), {
          target: { value: 'Updated description' },
        });
      });

      act(() => {
        fireEvent.click(screen.getByText('Save Role'));
      });

      await waitFor(() => {
        expect(RolesService.updateRole).toHaveBeenCalledWith('2', {
          name: 'Viewer',
          description: 'Updated description',
          permissions: expect.any(Array),
        });
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Role updated successfully',
        );
      });
    });

    it('shows error when role loading fails', async () => {
      (RolesService.getRole as jest.Mock).mockResolvedValue({
        success: false,
        data: null,
        message: 'Failed to load role',
        errors: ['Not found'],
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Failed to load role',
        );
      });
    });
  });

  describe('Delete Role', () => {
    it('shows confirmation dialog when delete is clicked', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      expect(global.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this role?',
      );
    });

    it('does not delete role when confirmation is cancelled', async () => {
      (global.confirm as jest.Mock).mockReturnValue(false);

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      expect(RolesService.deleteRole).not.toHaveBeenCalled();
    });

    it('deletes role when confirmed', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);
      (RolesService.deleteRole as jest.Mock).mockResolvedValue({
        success: true,
        data: true,
        message: 'Role deleted successfully',
        errors: null,
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(RolesService.deleteRole).toHaveBeenCalledWith('1');
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Role deleted successfully',
        );
      });
    });

    it('shows error message when deletion fails', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);
      (RolesService.deleteRole as jest.Mock).mockResolvedValue({
        success: false,
        data: false,
        message: 'Cannot delete role with active users',
        errors: ['Role in use'],
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Cannot delete role with active users',
        );
      });
    });
  });

  describe('Permission Management', () => {
    it('toggles permission selection', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Create New Role'));
      });

      await waitFor(() => {
        // Use document.querySelector with the checkbox ID
        const checkbox = document.querySelector(
          '#permission-1',
        ) as HTMLInputElement;
        expect(checkbox).toBeInTheDocument();
      });

      const checkbox = document.querySelector(
        '#permission-1',
      ) as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });

    it('groups permissions by category prefix', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Create New Role'));
      });

      await waitFor(() => {
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Role')).toBeInTheDocument();
      });
    });

    it('includes selected permissions in create request', async () => {
      (RolesService.createRole as jest.Mock).mockResolvedValue({
        success: true,
        data: true,
        message: null,
        errors: null,
      });

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Create New Role'));
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText('Role Name');
        fireEvent.change(nameInput, {
          target: { value: 'Test Role' },
        });
      });

      const permission1 = document.querySelector(
        '#permission-1',
      ) as HTMLInputElement;
      const permission2 = document.querySelector(
        '#permission-4',
      ) as HTMLInputElement;

      fireEvent.click(permission1);
      fireEvent.click(permission2);

      act(() => {
        fireEvent.click(screen.getByText('Save Role'));
      });

      await waitFor(() => {
        expect(RolesService.createRole).toHaveBeenCalledWith({
          name: 'Test Role',
          description: '',
          permissions: ['1', '4'],
        });
      });
    });
  });

  describe('Form Validation', () => {
    it('requires role name to submit', async () => {
      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Create New Role'));
      });

      const saveButton = screen.getByText('Save Role');
      expect(saveButton).toBeEnabled();

      // HTML5 validation should prevent submission with empty required field
      const nameInput = screen.getByLabelText('Role Name') as HTMLInputElement;
      expect(nameInput.required).toBe(true);
    });

    it('disables buttons while submitting', async () => {
      (RolesService.createRole as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  success: true,
                  data: true,
                  message: null,
                  errors: null,
                }),
              100,
            );
          }),
      );

      act(() => {
        render(<RolesManagementBlock />);
      });

      await waitFor(() => {
        fireEvent.click(screen.getByText('Create New Role'));
      });

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Role Name'), {
          target: { value: 'Test' },
        });
      });

      act(() => {
        fireEvent.click(screen.getByText('Save Role'));
      });

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
        expect(screen.getByText('Saving...')).toBeDisabled();
        expect(screen.getByText('Cancel')).toBeDisabled();
      });
    });
  });

  describe('Custom Styling', () => {
    it('applies custom styles to container', async () => {
      const customStyles = {
        backgroundColor: 'red',
        padding: '20px',
      };

      act(() => {
        render(<RolesManagementBlock customStyles={customStyles} />);
      });

      await waitFor(() => {
        const container = document.querySelector('.roles-management-container');
        expect(container).toHaveStyle('padding: 20px');
        // Note: backgroundColor might be rendered as inline style
        expect(container).toHaveAttribute('style');
      });
    });
  });
});
