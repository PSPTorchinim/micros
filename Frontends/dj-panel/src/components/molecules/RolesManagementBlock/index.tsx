import React, { useState, useEffect } from 'react';
import { RolesService } from '../../../services/roles-service';
import { PermissionsService } from '../../../services/permissions-service';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import {
  Role,
  GetPermissionsDTO,
  AddRoleRequest,
} from '../../../models/api/identity/apiMap';
import './index.css';

export interface RolesManagementBlockProps {
  title?: string;
  description?: string;
  customStyles?: Record<string, unknown>;
}

export const RolesManagementBlock: React.FC<RolesManagementBlockProps> = ({
  title = 'Roles Management',
  description = 'Manage roles and their permissions.',
  customStyles = {},
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<GetPermissionsDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        RolesService.getRoles(),
        PermissionsService.getPermissions(),
      ]);

      if (rolesResponse.success && rolesResponse.data) {
        setRoles(rolesResponse.data);
      } else {
        setError(rolesResponse.message || 'Failed to load roles');
      }

      if (permissionsResponse.success && permissionsResponse.data) {
        setPermissions(permissionsResponse.data);
      } else {
        const permissionsError =
          permissionsResponse.message || 'Failed to load permissions';
        setError((prevError) =>
          prevError ? `${prevError}. ${permissionsError}` : permissionsError,
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingRoleId(null);
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions([]);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = async (roleId: string) => {
    setError('');
    setSuccess('');
    try {
      const response = await RolesService.getRole(roleId);
      if (response.success && response.data) {
        setEditingRoleId(roleId);
        setRoleName(response.data.name || '');
        setRoleDescription(response.data.description || '');
        setSelectedPermissions(
          response.data.permissions?.map((p) => p.id || '') || [],
        );
        setShowForm(true);
      } else {
        setError(response.message || 'Failed to load role details');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load role details',
      );
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      const response = await RolesService.deleteRole(roleId);
      if (response.success) {
        setSuccess('Role deleted successfully');
        await loadData();
      } else {
        setError(response.message || 'Failed to delete role');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const roleData: AddRoleRequest = {
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions,
    };

    try {
      let response;
      if (editingRoleId) {
        response = await RolesService.updateRole(editingRoleId, roleData);
      } else {
        response = await RolesService.createRole(roleData);
      }

      if (response.success) {
        setSuccess(
          editingRoleId
            ? 'Role updated successfully'
            : 'Role created successfully',
        );
        setShowForm(false);
        await loadData();
      } else {
        setError(
          response.message || response.errors?.[0] || 'Failed to save role',
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setError('');
  };

  if (isLoading) {
    return <div className="roles-management-loading">Loading...</div>;
  }

  return (
    <div className="roles-management-container" style={customStyles}>
      <div className="roles-management-header">
        <div>
          <h1 className="roles-management-title">{title}</h1>
          <p className="roles-management-description">{description}</p>
        </div>
        {!showForm && (
          <Button onClick={handleCreateNew}>Create New Role</Button>
        )}
      </div>

      {error && (
        <p className="roles-management-error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="roles-management-success" role="alert">
          {success}
        </p>
      )}

      {showForm ? (
        <form className="roles-management-form" onSubmit={handleSubmit}>
          <h2 className="roles-management-form-title">
            {editingRoleId ? 'Edit Role' : 'Create New Role'}
          </h2>

          <Input
            label="Role Name"
            type="text"
            id="roleName"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            fullWidth
            required
          />

          <Input
            label="Description"
            type="text"
            id="roleDescription"
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            placeholder="Enter role description"
            fullWidth
          />

          <div className="roles-management-permissions">
            <label className="roles-management-permissions-label">
              Permissions
            </label>
            {(() => {
              // Group permissions by their prefix (part before ':')
              const grouped = permissions.reduce(
                (acc, permission) => {
                  const name = permission.name || '';
                  const prefix = name.includes(':')
                    ? name.split(':')[0]
                    : 'other';
                  if (!acc[prefix]) {
                    acc[prefix] = [];
                  }
                  acc[prefix].push(permission);
                  return acc;
                },
                {} as Record<string, typeof permissions>,
              );

              // Sort groups by name
              const sortedGroups = Object.keys(grouped).sort();

              return sortedGroups.map((group) => (
                <div key={group} className="roles-management-permission-group">
                  <h4 className="roles-management-permission-group-title">
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </h4>
                  <div className="roles-management-permissions-grid">
                    {grouped[group].map((permission) => (
                      <label
                        key={permission.id}
                        htmlFor={`permission-${permission.id}`}
                        className="roles-management-permission-item"
                      >
                        <input
                          type="checkbox"
                          id={`permission-${permission.id}`}
                          checked={selectedPermissions.includes(
                            permission.id || '',
                          )}
                          onChange={() =>
                            handlePermissionToggle(permission.id || '')
                          }
                        />
                        <span className="roles-management-permission-name">
                          {permission.name}
                        </span>
                        {permission.description && (
                          <span className="roles-management-permission-description">
                            {permission.description}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>

          <div className="roles-management-form-actions">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Role'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="roles-management-list">
          {roles.length === 0 ? (
            <p className="roles-management-empty">
              No roles found. Create your first role to get started.
            </p>
          ) : (
            <table className="roles-management-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    <td>{role.description || '-'}</td>
                    <td>{role.permissions?.length || 0} permissions</td>
                    <td className="roles-management-actions">
                      <Button
                        size="small"
                        variant="outline"
                        onClick={() => handleEdit(role.id || '')}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outline"
                        onClick={() => handleDelete(role.id || '')}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
