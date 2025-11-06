import React, { useState } from 'react';
import './index.css';
import { UsersService } from '../../../services/users-service';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../../../components/molecules/ForgotPasswordForm';

export const ForgotPasswordComponent = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (email: string) => {
    try {
      const response = await UsersService.forgotPassword(email);
      if (response.success) {
        navigate('/users/login');
      } else {
        setError(response.message || 'Failed to send password reset link.');
      }
    } catch (err) {
      setError('Failed to send password reset link. Please try again later.');
    }
  };

  return (
    <div className="content-container">
      <ForgotPasswordForm onSubmit={handleSubmit} error={error} />
    </div>
  );
};
