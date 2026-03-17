// @ts-ignore - React is needed for JSX
import React, { useEffect, useRef, useState } from 'react';
import {
  CompanyTypeAdminService,
  CompanyTypeDTO,
  CompanyTypeSyncResultDTO,
  CreateCompanyTypeDTO,
  CreateCompanyTypeFieldDTO,
  UpdateCompanyTypeDTO,
} from '../../../services/company-type-admin-service';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './index.css';

type Tab = 'list' | 'create' | 'edit' | 'add-field' | 'sync' | 'import';

export interface CompanyTypeAdminBlockProps {
  title?: string;
  description?: string;
  customStyles?: Record<string, unknown>;
}

const LANGUAGES = ['en', 'de', 'fr', 'es', 'pl'];
const FIELD_TYPES = ['text', 'number', 'email', 'select', 'textarea'];

export const CompanyTypeAdminBlock: React.FC<CompanyTypeAdminBlockProps> = ({
  title = 'Company Types Administration',
  description = 'Manage company type definitions, fields, and sync with external data sources.',
  customStyles = {},
}) => {
  const [tab, setTab] = useState<Tab>('list');
  const [companyTypes, setCompanyTypes] = useState<CompanyTypeDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingType, setEditingType] = useState<CompanyTypeDTO | null>(null);
  const [addFieldTypeId, setAddFieldTypeId] = useState<string>('');
  const [syncResult, setSyncResult] = useState<CompanyTypeSyncResultDTO | null>(
    null,
  );

  // Create/Edit form state
  const [formCode, setFormCode] = useState('');
  const [formCountryCode, setFormCountryCode] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formTranslations, setFormTranslations] = useState(
    LANGUAGES.map((lang) => ({ languageCode: lang, name: '', description: '' })),
  );

  // Add Field form state
  const [fieldKey, setFieldKey] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldRegex, setFieldRegex] = useState('');
  const [fieldDisplayOrder, setFieldDisplayOrder] = useState(0);
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldMaxLength, setFieldMaxLength] = useState('');
  const [fieldMinLength, setFieldMinLength] = useState('');
  const [fieldTranslations, setFieldTranslations] = useState(
    LANGUAGES.map((lang) => ({
      languageCode: lang,
      label: '',
      helpText: '',
      validationMessage: '',
    })),
  );

  // Sync state
  const [syncCountryCode, setSyncCountryCode] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadTypes();
  }, []);

  const loadTypes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await CompanyTypeAdminService.getAll();
      setCompanyTypes(data);
    } catch {
      setError('Failed to load company types.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
    setSyncResult(null);
  };

  // ── Create ────────────────────────────────────────────────────────────────

  const openCreate = () => {
    clearMessages();
    setFormCode('');
    setFormCountryCode('');
    setFormIsActive(true);
    setFormDisplayOrder(0);
    setFormTranslations(
      LANGUAGES.map((lang) => ({
        languageCode: lang,
        name: '',
        description: '',
      })),
    );
    setTab('create');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    const translations = formTranslations.filter((t) => t.name.trim());
    if (!formCode || !formCountryCode || translations.length === 0) {
      setError('Code, country code, and at least one translation are required.');
      return;
    }
    const dto: CreateCompanyTypeDTO = {
      code: formCode.toUpperCase(),
      countryCode: formCountryCode.toUpperCase(),
      isActive: formIsActive,
      displayOrder: formDisplayOrder,
      translations,
    };
    const result = await CompanyTypeAdminService.create(dto);
    if (result) {
      setSuccess('Company type created successfully.');
      await loadTypes();
      setTab('list');
    } else {
      setError('Failed to create company type.');
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────

  const openEdit = (ct: CompanyTypeDTO) => {
    clearMessages();
    setEditingType(ct);
    setFormIsActive(ct.isActive);
    setFormDisplayOrder(ct.displayOrder);
    setFormTranslations(
      LANGUAGES.map((lang) => ({
        languageCode: lang,
        name: lang === 'en' ? ct.name : '',
        description: lang === 'en' ? ct.description : '',
      })),
    );
    setTab('edit');
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    clearMessages();
    const translations = formTranslations.filter((t) => t.name.trim());
    const dto: UpdateCompanyTypeDTO = {
      isActive: formIsActive,
      displayOrder: formDisplayOrder,
      translations,
    };
    const ok = await CompanyTypeAdminService.update(editingType.id, dto);
    if (ok) {
      setSuccess('Company type updated successfully.');
      await loadTypes();
      setTab('list');
    } else {
      setError('Failed to update company type.');
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this company type?')) return;
    clearMessages();
    const ok = await CompanyTypeAdminService.remove(id);
    if (ok) {
      setSuccess('Deleted successfully.');
      await loadTypes();
    } else {
      setError('Failed to delete company type.');
    }
  };

  // ── Add Field ─────────────────────────────────────────────────────────────

  const openAddField = (typeId: string) => {
    clearMessages();
    setAddFieldTypeId(typeId);
    setFieldKey('');
    setFieldType('text');
    setFieldRequired(false);
    setFieldRegex('');
    setFieldDisplayOrder(0);
    setFieldPlaceholder('');
    setFieldMaxLength('');
    setFieldMinLength('');
    setFieldTranslations(
      LANGUAGES.map((lang) => ({
        languageCode: lang,
        label: '',
        helpText: '',
        validationMessage: '',
      })),
    );
    setTab('add-field');
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    const translations = fieldTranslations.filter((t) => t.label.trim());
    if (!fieldKey || translations.length === 0) {
      setError('Field key and at least one translation label are required.');
      return;
    }
    const dto: CreateCompanyTypeFieldDTO = {
      fieldKey,
      fieldType,
      isRequired: fieldRequired,
      validationRegex: fieldRegex || undefined,
      displayOrder: fieldDisplayOrder,
      placeholder: fieldPlaceholder || undefined,
      maxLength: fieldMaxLength ? parseInt(fieldMaxLength, 10) : undefined,
      minLength: fieldMinLength ? parseInt(fieldMinLength, 10) : undefined,
      translations,
    };
    const ok = await CompanyTypeAdminService.addField(addFieldTypeId, dto);
    if (ok) {
      setSuccess('Field added successfully.');
      setTab('list');
    } else {
      setError('Failed to add field.');
    }
  };

  // ── Sync ──────────────────────────────────────────────────────────────────

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!syncCountryCode) {
      setError('Please enter a country code.');
      return;
    }
    setIsSyncing(true);
    const result = await CompanyTypeAdminService.syncFromGleif(
      syncCountryCode.toUpperCase(),
    );
    setIsSyncing(false);
    if (result) {
      setSyncResult(result);
      setSuccess(
        `Sync completed: ${result.created} created, ${result.updated} updated, ${result.failed} failed.`,
      );
      await loadTypes();
    } else {
      setError('Sync failed. Check server logs.');
    }
  };

  // ── Import ────────────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImportFile(file);
    clearMessages();
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!importFile) {
      setError('Please select a JSON file to import.');
      return;
    }
    setIsImporting(true);
    const result = await CompanyTypeAdminService.importFromFile(importFile);
    setIsImporting(false);
    if (result) {
      setSyncResult(result);
      setSuccess(
        `Import completed: ${result.created} created, ${result.updated} updated, ${result.failed} failed.`,
      );
      setImportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadTypes();
    } else {
      setError('Import failed. Ensure the file is a valid JSON array of company type definitions.');
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const updateFormTranslation = (
    index: number,
    field: 'name' | 'description',
    value: string,
  ) => {
    setFormTranslations((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  };

  const updateFieldTranslation = (
    index: number,
    field: 'label' | 'helpText' | 'validationMessage',
    value: string,
  ) => {
    setFieldTranslations((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="cta-container" style={customStyles}>
        <p>Loading company types…</p>
      </div>
    );
  }

  return (
    <div className="ctadmin-container" style={customStyles}>
      <div className="ctadmin-header">
        <div>
          <h1 className="ctadmin-title">{title}</h1>
          <p className="ctadmin-description">{description}</p>
        </div>
        {tab === 'list' && (
          <div className="ctadmin-header-actions">
            <Button onClick={openCreate}>New Company Type</Button>
            <Button variant="outline" onClick={() => { clearMessages(); setTab('sync'); }}>
              Sync (GLEIF)
            </Button>
            <Button variant="outline" onClick={() => { clearMessages(); setTab('import'); }}>
              Import JSON
            </Button>
          </div>
        )}
        {tab !== 'list' && (
          <Button variant="outline" onClick={() => { clearMessages(); setTab('list'); }}>
            ← Back to list
          </Button>
        )}
      </div>

      {error && <p className="ctadmin-error" role="alert">{error}</p>}
      {success && <p className="ctadmin-success" role="status">{success}</p>}

      {/* ── LIST ── */}
      {tab === 'list' && (
        <div className="ctadmin-list">
          {companyTypes.length === 0 ? (
            <p className="ctadmin-empty">No company types found. Create one or sync from GLEIF.</p>
          ) : (
            <table className="ctadmin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Country</th>
                  <th>Name</th>
                  <th>Active</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companyTypes.map((ct) => (
                  <tr key={ct.id}>
                    <td><code>{ct.code}</code></td>
                    <td>{ct.countryCode}</td>
                    <td>{ct.name}</td>
                    <td>
                      <span className={`ctadmin-badge ${ct.isActive ? 'ctadmin-badge--active' : 'ctadmin-badge--inactive'}`}>
                        {ct.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{ct.displayOrder}</td>
                    <td className="ctadmin-actions">
                      <Button size="small" variant="outline" onClick={() => openEdit(ct)}>Edit</Button>
                      <Button size="small" variant="outline" onClick={() => openAddField(ct.id)}>+ Field</Button>
                      <Button size="small" variant="outline" onClick={() => handleDelete(ct.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── CREATE ── */}
      {(tab === 'create' || tab === 'edit') && (
        <form
          className="ctadmin-form"
          onSubmit={tab === 'create' ? handleCreate : handleEdit}
        >
          <h2 className="ctadmin-form-title">
            {tab === 'create' ? 'New Company Type' : `Edit: ${editingType?.code} (${editingType?.countryCode})`}
          </h2>

          {tab === 'create' && (
            <div className="ctadmin-form-row">
              <Input
                label="Code *"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                placeholder="LLC"
                required
              />
              <Input
                label="Country Code * (2-letter ISO)"
                value={formCountryCode}
                onChange={(e) => setFormCountryCode(e.target.value.toUpperCase())}
                placeholder="US"
                required
              />
            </div>
          )}

          <div className="ctadmin-form-row">
            <div className="ctadmin-checkbox-row">
              <input
                type="checkbox"
                id="isActive"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
              />
              <label htmlFor="isActive">Active</label>
            </div>
            <Input
              label="Display Order"
              type="number"
              value={String(formDisplayOrder)}
              onChange={(e) => setFormDisplayOrder(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <h3 className="ctadmin-section-title">Translations</h3>
          {formTranslations.map((t, i) => (
            <div key={t.languageCode} className="ctadmin-translation-row">
              <span className="ctadmin-lang-badge">{t.languageCode.toUpperCase()}</span>
              <Input
                label="Name"
                value={t.name}
                onChange={(e) => updateFormTranslation(i, 'name', e.target.value)}
                placeholder={`Name in ${t.languageCode}`}
              />
              <Input
                label="Description"
                value={t.description}
                onChange={(e) => updateFormTranslation(i, 'description', e.target.value)}
                placeholder={`Description in ${t.languageCode}`}
              />
            </div>
          ))}

          <div className="ctadmin-form-actions">
            <Button type="submit">
              {tab === 'create' ? 'Create' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={() => { clearMessages(); setTab('list'); }}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* ── ADD FIELD ── */}
      {tab === 'add-field' && (
        <form className="ctadmin-form" onSubmit={handleAddField}>
          <h2 className="ctadmin-form-title">Add Field</h2>

          <div className="ctadmin-form-row">
            <Input
              label="Field Key *"
              value={fieldKey}
              onChange={(e) => setFieldKey(e.target.value)}
              placeholder="taxId"
              required
            />
            <div className="ctadmin-select-wrap">
              <label className="ctadmin-label">Field Type *</label>
              <select
                className="ctadmin-select"
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value)}
              >
                {FIELD_TYPES.map((ft) => (
                  <option key={ft} value={ft}>{ft}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ctadmin-form-row">
            <div className="ctadmin-checkbox-row">
              <input
                type="checkbox"
                id="fieldRequired"
                checked={fieldRequired}
                onChange={(e) => setFieldRequired(e.target.checked)}
              />
              <label htmlFor="fieldRequired">Required</label>
            </div>
            <Input
              label="Display Order"
              type="number"
              value={String(fieldDisplayOrder)}
              onChange={(e) => setFieldDisplayOrder(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="ctadmin-form-row">
            <Input
              label="Validation Regex"
              value={fieldRegex}
              onChange={(e) => setFieldRegex(e.target.value)}
              placeholder="^\d{10}$"
            />
            <Input
              label="Placeholder"
              value={fieldPlaceholder}
              onChange={(e) => setFieldPlaceholder(e.target.value)}
              placeholder="Enter value…"
            />
          </div>

          <div className="ctadmin-form-row">
            <Input
              label="Min Length"
              type="number"
              value={fieldMinLength}
              onChange={(e) => setFieldMinLength(e.target.value)}
            />
            <Input
              label="Max Length"
              type="number"
              value={fieldMaxLength}
              onChange={(e) => setFieldMaxLength(e.target.value)}
            />
          </div>

          <h3 className="ctadmin-section-title">Field Translations</h3>
          {fieldTranslations.map((t, i) => (
            <div key={t.languageCode} className="ctadmin-translation-row">
              <span className="ctadmin-lang-badge">{t.languageCode.toUpperCase()}</span>
              <Input
                label="Label"
                value={t.label}
                onChange={(e) => updateFieldTranslation(i, 'label', e.target.value)}
                placeholder={`Label in ${t.languageCode}`}
              />
              <Input
                label="Help Text"
                value={t.helpText}
                onChange={(e) => updateFieldTranslation(i, 'helpText', e.target.value)}
                placeholder={`Help in ${t.languageCode}`}
              />
              <Input
                label="Validation Message"
                value={t.validationMessage}
                onChange={(e) => updateFieldTranslation(i, 'validationMessage', e.target.value)}
                placeholder={`Error in ${t.languageCode}`}
              />
            </div>
          ))}

          <div className="ctadmin-form-actions">
            <Button type="submit">Add Field</Button>
            <Button type="button" variant="outline" onClick={() => { clearMessages(); setTab('list'); }}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* ── SYNC (GLEIF) ── */}
      {tab === 'sync' && (
        <div className="ctadmin-form">
          <h2 className="ctadmin-form-title">Sync from GLEIF API</h2>
          <p className="ctadmin-help-text">
            Fetches legal entity form codes from the{' '}
            <a href="https://api.gleif.org/api/v1/entity-legal-forms" target="_blank" rel="noreferrer">
              GLEIF API
            </a>{' '}
            for the specified country and upserts them into the database. Registration fields
            (NIP, KRS, EIN, HRB, etc.) are applied from the built-in jurisdiction knowledge base.
          </p>
          <form onSubmit={handleSync}>
            <Input
              label="Country Code (2-letter ISO, e.g. PL, DE, US)"
              value={syncCountryCode}
              onChange={(e) => setSyncCountryCode(e.target.value.toUpperCase())}
              placeholder="PL"
              required
            />
            <div className="ctadmin-form-actions">
              <Button type="submit" disabled={isSyncing}>
                {isSyncing ? 'Syncing…' : 'Sync'}
              </Button>
            </div>
          </form>
          {syncResult && (
            <div className="ctadmin-sync-result">
              <p><strong>Created:</strong> {syncResult.created}</p>
              <p><strong>Updated:</strong> {syncResult.updated}</p>
              <p><strong>Failed:</strong> {syncResult.failed}</p>
              {syncResult.errors.length > 0 && (
                <ul className="ctadmin-errors-list">
                  {syncResult.errors.map((e, i) => (
                    <li key={`sync-err-${i}-${e.slice(0, 20)}`}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── IMPORT JSON ── */}
      {tab === 'import' && (
        <div className="ctadmin-form">
          <h2 className="ctadmin-form-title">Import Company Types from JSON</h2>
          <p className="ctadmin-help-text">
            Upload a <code>.json</code> file containing an array of company type definitions.
            Existing types (matched by <code>code + countryCode</code>) will be updated; new ones
            will be created. Download the{' '}
            <a
              href="data:application/json;charset=utf-8,%5B%7B%22code%22%3A%22LLC%22%2C%22countryCode%22%3A%22US%22%2C%22isActive%22%3Atrue%2C%22displayOrder%22%3A1%2C%22translations%22%3A%5B%7B%22languageCode%22%3A%22en%22%2C%22name%22%3A%22Limited%20Liability%20Company%22%2C%22description%22%3A%22%22%7D%5D%2C%22fields%22%3A%5B%5D%7D%5D"
              download="company-types-template.json"
            >
              example template
            </a>{' '}
            to see the expected format.
          </p>
          <form onSubmit={handleImport}>
            <div className="ctadmin-file-upload">
              <label className="ctadmin-label" htmlFor="importFile">
                JSON File *
              </label>
              <input
                id="importFile"
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="ctadmin-file-input"
                onChange={handleFileChange}
              />
              {importFile && (
                <span className="ctadmin-file-name">{importFile.name}</span>
              )}
            </div>
            <div className="ctadmin-form-actions">
              <Button type="submit" disabled={isImporting || !importFile}>
                {isImporting ? 'Importing…' : 'Import'}
              </Button>
            </div>
          </form>
          {syncResult && (
            <div className="ctadmin-sync-result">
              <p><strong>Created:</strong> {syncResult.created}</p>
              <p><strong>Updated:</strong> {syncResult.updated}</p>
              <p><strong>Failed:</strong> {syncResult.failed}</p>
              {syncResult.errors.length > 0 && (
                <ul className="ctadmin-errors-list">
                  {syncResult.errors.map((e, i) => (
                    <li key={`import-err-${i}-${e.slice(0, 20)}`}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
