import React, { useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import {
  CompanyService,
  UpdateCompanyDTO,
} from '../../../services/company-service';
import './index.css';

export interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onSuccess: () => void;
}

export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
  isOpen,
  onClose,
  onSkip,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UpdateCompanyDTO>({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof UpdateCompanyDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.country ||
      !formData.city ||
      !formData.postCode ||
      !formData.addressLine1
    ) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await CompanyService.updateCompany(formData);
      if (success) {
        onSuccess();
        setFormData({
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
        setError('Failed to create company. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipClick = () => {
    onSkip();
    setFormData({
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
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Your Company Profile"
      closeOnOverlayClick={false}
      size="medium"
    >
      <div className="create-company-modal">
        <p className="create-company-modal__description">
          Welcome! It looks like you don't have a company profile yet. Please
          fill in your company details to get started, or skip for now and
          complete this later.
        </p>

        {error && <div className="create-company-modal__error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-company-modal__form">
          <Input
            label="Company Name *"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter company name"
            required
          />

          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="company@example.com"
            required
          />

          <Input
            label="Phone *"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
          />

          <div className="create-company-modal__form-row">
            <Input
              label="Country *"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="United States"
              required
            />

            <Input
              label="City *"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="New York"
              required
            />
          </div>

          <Input
            label="Postal Code *"
            value={formData.postCode}
            onChange={(e) => handleChange('postCode', e.target.value)}
            placeholder="10001"
            required
          />

          <Input
            label="Address Line 1 *"
            value={formData.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
            placeholder="123 Main Street"
            required
          />

          <Input
            label="Address Line 2"
            value={formData.addressLine2 || ''}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
            placeholder="Suite 100 (optional)"
          />

          <div className="create-company-modal__actions">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkipClick}
              disabled={isSubmitting}
            >
              Skip for Now
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Company'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
