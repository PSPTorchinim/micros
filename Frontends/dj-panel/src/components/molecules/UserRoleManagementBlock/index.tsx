import React, { useState, useEffect } from 'react';
import {
  UserRoleManagementService,
  UserWithRoleAssignments,
} from '../../../services/user-role-management-service';
import { RolesService } from '../../../services/roles-service';
import { Role } from '../../../models/api/identity/apiMap';
import { Button } from '../../atoms/Button';
import './user-role-management.css';

export interface UserRoleManagementBlockProps {
  headerText?: string;
  descriptionText?: string;
  styleOverrides?: Record<string, unknown>;
}

export const UserRoleManagementBlock: React.FC<
  UserRoleManagementBlockProps
> = ({
  headerText = 'User Role Administration',
  descriptionText = 'Assign and manage roles for users in the system.',
  styleOverrides = {},
}) => {
  const [userList, setUserList] = useState<UserWithRoleAssignments[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [checkedRoleIds, setCheckedRoleIds] = useState<Set<string>>(new Set());
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  useEffect(() => {
    void initializeData();
  }, []);

  const initializeData = async () => {
    setIsLoadingData(true);
    setErrorText('');
    try {
      const [usersResult, rolesResult] = await Promise.all([
        UserRoleManagementService.fetchAllUsersWithRoles(),
        RolesService.getRoles(),
      ]);

      if (usersResult.isSuccessful && usersResult.users) {
        setUserList(usersResult.users);
      } else {
        setErrorText(usersResult.errorMessage ?? 'Unable to load users');
      }

      if (rolesResult.success && rolesResult.data) {
        setAvailableRoles(rolesResult.data);
      } else {
        const roleError = rolesResult.message ?? 'Unable to load roles';
        setErrorText((prev) => (prev ? `${prev}. ${roleError}` : roleError));
      }
    } catch (err) {
      setErrorText(
        err instanceof Error ? err.message : 'Data loading failed',
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const beginEditingUserRoles = (user: UserWithRoleAssignments) => {
    setActiveUserId(user.userId);
    setSuccessText('');
    setErrorText('');
    const currentRoleIds = user.assignedRoles.map((r) => r.roleId);
    setCheckedRoleIds(new Set(currentRoleIds));
  };

  const cancelEditingRoles = () => {
    setActiveUserId(null);
    setCheckedRoleIds(new Set());
    setErrorText('');
  };

  const persistRoleChanges = async () => {
    if (!activeUserId) return;

    setIsSavingChanges(true);
    setErrorText('');
    setSuccessText('');

    try {
      const roleIdArray = Array.from(checkedRoleIds);
      const saveResult =
        await UserRoleManagementService.modifyUserRoleAssignments(
          activeUserId,
          roleIdArray,
        );

      if (saveResult.success) {
        setSuccessText('Role assignments updated successfully');
        setActiveUserId(null);
        setCheckedRoleIds(new Set());
        await initializeData();
      } else {
        const errorMsg =
          saveResult.message ??
          saveResult.errors?.[0] ??
          'Unable to update role assignments';
        setErrorText(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? `Role update failed: ${err.message}`
          : 'An unexpected error occurred while updating roles';
      setErrorText(errorMsg);
    } finally {
      setIsSavingChanges(false);
    }
  };

  const toggleRoleSelection = (roleId: string) => {
    setCheckedRoleIds((previousSet) => {
      const updatedSet = new Set(previousSet);
      if (updatedSet.has(roleId)) {
        updatedSet.delete(roleId);
      } else {
        updatedSet.add(roleId);
      }
      return updatedSet;
    });
  };

  if (isLoadingData) {
    return <div className="user-role-mgmt-loading">Loading data...</div>;
  }

  return (
    <div className="user-role-mgmt-container" style={styleOverrides}>
      <div className="user-role-mgmt-header">
        <div>
          <h1 className="user-role-mgmt-title">{headerText}</h1>
          <p className="user-role-mgmt-description">{descriptionText}</p>
        </div>
      </div>

      {errorText && (
        <p className="user-role-mgmt-error" role="alert">
          {errorText}
        </p>
      )}
      {successText && (
        <p className="user-role-mgmt-success" role="alert">
          {successText}
        </p>
      )}

      {activeUserId ? (
        <div className="user-role-mgmt-editor">
          <h2 className="user-role-mgmt-editor-title">
            Editing Role Assignments
          </h2>
          <p className="user-role-mgmt-editor-user">
            User: {userList.find((u) => u.userId === activeUserId)?.userEmail}
          </p>

          <div className="user-role-mgmt-role-selector">
            <label className="user-role-mgmt-selector-label">
              Select Roles to Assign
            </label>
            <div className="user-role-mgmt-role-grid">
              {availableRoles.map((role) => (
                <label
                  key={role.id}
                  htmlFor={`role-checkbox-${role.id}`}
                  className="user-role-mgmt-role-option"
                >
                  <input
                    type="checkbox"
                    id={`role-checkbox-${role.id}`}
                    checked={checkedRoleIds.has(role.id ?? '')}
                    onChange={() => toggleRoleSelection(role.id ?? '')}
                    className="user-role-mgmt-checkbox"
                  />
                  <span className="user-role-mgmt-role-label">
                    {role.name}
                  </span>
                  {role.description && (
                    <span className="user-role-mgmt-role-desc">
                      {role.description}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="user-role-mgmt-editor-actions">
            <Button onClick={persistRoleChanges} disabled={isSavingChanges}>
              {isSavingChanges ? 'Saving Changes...' : 'Save Role Assignments'}
            </Button>
            <Button
              variant="outline"
              onClick={cancelEditingRoles}
              disabled={isSavingChanges}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="user-role-mgmt-table-wrapper">
          {userList.length === 0 ? (
            <p className="user-role-mgmt-empty-state">
              No users available in the system.
            </p>
          ) : (
            <table className="user-role-mgmt-table">
              <thead>
                <tr>
                  <th>Email Address</th>
                  <th>Account Status</th>
                  <th>Assigned Roles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userEmail}</td>
                    <td>
                      <span
                        className={
                          user.isActive
                            ? 'user-status-active'
                            : 'user-status-inactive'
                        }
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {user.assignedRoles.length > 0 ? (
                        <span className="user-role-mgmt-role-list">
                          {user.assignedRoles
                            .map((r) => r.roleName)
                            .join(', ')}
                        </span>
                      ) : (
                        <span className="user-role-mgmt-no-roles">
                          No roles assigned
                        </span>
                      )}
                    </td>
                    <td className="user-role-mgmt-action-cell">
                      <Button
                        size="small"
                        variant="outline"
                        onClick={() => beginEditingUserRoles(user)}
                      >
                        Manage Roles
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
