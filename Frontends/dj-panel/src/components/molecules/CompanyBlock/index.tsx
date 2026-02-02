import React, { useEffect, useState } from 'react';
import {
  CompanyService,
  CompanyDTO,
  UpdateCompanyDTO,
  CompanyUserDTO,
  AddCompanyUserDTO,
  CompanyStructureNodeDTO,
} from '../../../services/company-service';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './index.css';

export interface CompanyBlockProps {
  title?: string;
  description?: string;
  companyInfoTitle?: string;
  usersTitle?: string;
  structureTitle?: string;
  editButtonText?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  addUserButtonText?: string;
  removeUserButtonText?: string;
  customStyles?: Record<string, unknown>;
}

export const CompanyBlock: React.FC<CompanyBlockProps> = ({
  title = 'Company Details',
  description = 'View and manage your company information.',
  companyInfoTitle = 'Company Information',
  usersTitle = 'Company Users',
  structureTitle = 'Company Structure',
  editButtonText = 'Edit',
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  addUserButtonText = 'Add User',
  removeUserButtonText = 'Remove',
  customStyles = {},
}) => {
  const [company, setCompany] = useState<CompanyDTO | null>(null);
  const [users, setUsers] = useState<CompanyUserDTO[]>([]);
  const [structure, setStructure] = useState<CompanyStructureNodeDTO[]>([]);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editedCompany, setEditedCompany] = useState<UpdateCompanyDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<AddCompanyUserDTO>({
    userId: '',
    role: 'Member',
  });
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [newCompany, setNewCompany] = useState<UpdateCompanyDTO>({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    postCode: '',
    addressLine1: '',
    addressLine2: '',
    logo: '',
  });
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    void loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      const [companyData, usersData, structureData] = await Promise.all([
        CompanyService.getCompany(),
        CompanyService.getCompanyUsers(),
        CompanyService.getCompanyStructure(),
      ]);
      setCompany(companyData);
      setUsers(usersData);
      setStructure(structureData);
    } catch {
      // Error loading company data
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompany = () => {
    if (company) {
      setEditedCompany({
        name: company.name,
        email: company.email,
        phone: company.phone,
        country: company.country,
        city: company.city,
        postCode: company.postCode,
        addressLine1: company.addressLine1,
        addressLine2: company.addressLine2,
        logo: company.logo,
      });
      setIsEditingCompany(true);
    }
  };

  const handleSaveCompany = async () => {
    if (editedCompany) {
      const success = await CompanyService.updateCompany(editedCompany);
      if (success) {
        await loadCompanyData();
        setIsEditingCompany(false);
      } else {
        alert('Failed to update company information');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditingCompany(false);
    setEditedCompany(null);
  };

  const handleAddUser = async () => {
    if (newUser.userId && newUser.role) {
      const success = await CompanyService.addCompanyUser(newUser);
      if (success) {
        await loadCompanyData();
        setShowAddUser(false);
        setNewUser({ userId: '', role: 'Member' });
      } else {
        alert('Failed to add user');
      }
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      const success = await CompanyService.removeCompanyUser(userId);
      if (success) {
        await loadCompanyData();
      } else {
        alert('Failed to remove user');
      }
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    // Basic validation
    if (
      !newCompany.name ||
      !newCompany.email ||
      !newCompany.phone ||
      !newCompany.country ||
      !newCompany.city ||
      !newCompany.postCode ||
      !newCompany.addressLine1
    ) {
      setCreateError('Please fill in all required fields');
      return;
    }

    setIsCreatingCompany(true);
    try {
      const success = await CompanyService.updateCompany(newCompany);
      if (success) {
        await loadCompanyData();
        setNewCompany({
          name: '',
          email: '',
          phone: '',
          country: '',
          city: '',
          postCode: '',
          addressLine1: '',
          addressLine2: '',
          logo: '',
        });
      } else {
        setCreateError('Failed to create company. Please try again.');
      }
    } catch {
      setCreateError('An error occurred. Please try again.');
    } finally {
      setIsCreatingCompany(false);
    }
  };

  if (loading) {
    return (
      <div className="company-block-container" style={customStyles}>
        <div className="company-block-content">
          <p>Loading company information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-block-container" style={customStyles}>
      <div className="company-block-content">
        <h1 className="company-block-title">{title}</h1>
        <p className="company-block-description">{description}</p>

        {/* Company Information Section */}
        <div className="company-section">
          <div className="company-section-header">
            <h2 className="company-section-title">{companyInfoTitle}</h2>
            {company && !isEditingCompany && (
              <Button variant="outline" onClick={handleEditCompany}>
                {editButtonText}
              </Button>
            )}
          </div>

          {company ? (
            <div className="company-info">
              {!isEditingCompany ? (
                <div className="company-info-display">
                  <div className="company-field">
                    <label>Name:</label>
                    <span>{company.name}</span>
                  </div>
                  <div className="company-field">
                    <label>Email:</label>
                    <span>{company.email}</span>
                  </div>
                  <div className="company-field">
                    <label>Phone:</label>
                    <span>{company.phone}</span>
                  </div>
                  <div className="company-field">
                    <label>Country:</label>
                    <span>{company.country}</span>
                  </div>
                  <div className="company-field">
                    <label>City:</label>
                    <span>{company.city}</span>
                  </div>
                  <div className="company-field">
                    <label>Post Code:</label>
                    <span>{company.postCode}</span>
                  </div>
                  <div className="company-field">
                    <label>Address:</label>
                    <span>
                      {company.addressLine1}
                      {company.addressLine2 && `, ${company.addressLine2}`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="company-info-edit">
                  <Input
                    label="Name"
                    value={editedCompany?.name || ''}
                    onChange={(e) =>
                      setEditedCompany((prev) =>
                        prev ? { ...prev, name: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={editedCompany?.email || ''}
                    onChange={(e) =>
                      setEditedCompany((prev) =>
                        prev ? { ...prev, email: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Phone"
                    value={editedCompany?.phone || ''}
                    onChange={(e) =>
                      setEditedCompany((prev) =>
                        prev ? { ...prev, phone: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Country"
                    value={editedCompany?.country || ''}
                    onChange={(e) =>
                      setEditedCompany((prev) =>
                        prev ? { ...prev, country: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="City"
                    value={editedCompany?.city || ''}
                    onChange={(e) =>
                      setEditedCompany((prev) =>
                        prev ? { ...prev, city: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Post Code"
                    value={editedCompany?.postCode || ''}
                    onChange={(e) =>
                      setEditedCompany((prev) =>
                        prev ? { ...prev, postCode: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Address Line 1"
                    value={editedCompany?.addressLine1 || ''}
                    onChange={(e) =>
                      setEditedCompany((prev) =>
                        prev ? { ...prev, addressLine1: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Address Line 2"
                    value={editedCompany?.addressLine2 || ''}
                    onChange={(e) =>
                      setEditedCompany((prev) =>
                        prev ? { ...prev, addressLine2: e.target.value } : null,
                      )
                    }
                  />
                  <div className="company-edit-actions">
                    <Button onClick={handleSaveCompany}>
                      {saveButtonText}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      {cancelButtonText}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="company-info-create">
              <h3>Create Your Company Profile</h3>
              <p className="company-create-description">
                You don't have a company profile yet. Please fill in your
                company details to get started.
              </p>

              {createError && (
                <div className="company-create-error">{createError}</div>
              )}

              <form
                onSubmit={handleCreateCompany}
                className="company-create-form"
              >
                <Input
                  label="Company Name *"
                  value={newCompany.name}
                  onChange={(e) =>
                    setNewCompany((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Company Name"
                  required
                />

                <Input
                  label="Email *"
                  type="email"
                  value={newCompany.email}
                  onChange={(e) =>
                    setNewCompany((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Email"
                  required
                />

                <Input
                  label="Phone *"
                  value={newCompany.phone}
                  onChange={(e) =>
                    setNewCompany((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="Phone"
                  required
                />

                <Input
                  label="Country *"
                  value={newCompany.country}
                  onChange={(e) =>
                    setNewCompany((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  placeholder="United States"
                  required
                />

                <Input
                  label="City *"
                  value={newCompany.city}
                  onChange={(e) =>
                    setNewCompany((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="New York"
                  required
                />

                <Input
                  label="Postal Code *"
                  value={newCompany.postCode}
                  onChange={(e) =>
                    setNewCompany((prev) => ({
                      ...prev,
                      postCode: e.target.value,
                    }))
                  }
                  placeholder="10001"
                  required
                />

                <Input
                  label="Address Line 1 *"
                  value={newCompany.addressLine1}
                  onChange={(e) =>
                    setNewCompany((prev) => ({
                      ...prev,
                      addressLine1: e.target.value,
                    }))
                  }
                  placeholder="123 Main Street"
                  required
                />

                <Input
                  label="Address Line 2"
                  value={newCompany.addressLine2 || ''}
                  onChange={(e) =>
                    setNewCompany((prev) => ({
                      ...prev,
                      addressLine2: e.target.value,
                    }))
                  }
                  placeholder="Suite 100 (optional)"
                />

                <div className="company-create-actions">
                  <Button type="submit" disabled={isCreatingCompany}>
                    {isCreatingCompany ? 'Creating...' : 'Create Company'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Users Section */}
        <div className="company-section">
          <div className="company-section-header">
            <h2 className="company-section-title">{usersTitle}</h2>
            <Button variant="outline" onClick={() => setShowAddUser(true)}>
              {addUserButtonText}
            </Button>
          </div>

          {showAddUser && (
            <div className="company-add-user">
              <Input
                label="User ID"
                value={newUser.userId}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, userId: e.target.value }))
                }
                placeholder="Enter user ID"
              />
              <Input
                label="Role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, role: e.target.value }))
                }
                placeholder="e.g., Member, Admin"
              />
              <div className="company-add-user-actions">
                <Button onClick={handleAddUser}>{addUserButtonText}</Button>
                <Button variant="outline" onClick={() => setShowAddUser(false)}>
                  {cancelButtonText}
                </Button>
              </div>
            </div>
          )}

          {users.length > 0 ? (
            <div className="company-users-list">
              {users.map((user) => (
                <div key={user.id} className="company-user-item">
                  <div className="company-user-info">
                    <span className="company-user-name">{user.username}</span>
                    <span className="company-user-email">{user.email}</span>
                    <span className="company-user-role">{user.role}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveUser(user.userId)}
                  >
                    {removeUserButtonText}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>No users assigned to the company.</p>
          )}
        </div>

        {/* Structure Section */}
        <div className="company-section">
          <h2 className="company-section-title">{structureTitle}</h2>
          {structure.length > 0 ? (
            <div className="company-structure">
              <p>Company structure visualization (placeholder)</p>
              {/* This is a placeholder - structure visualization would be more complex */}
            </div>
          ) : (
            <p>No company structure defined.</p>
          )}
        </div>
      </div>
    </div>
  );
};
