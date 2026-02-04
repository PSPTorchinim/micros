// @ts-ignore - React is needed for JSX
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { CreateCompanyModal } from '../components/molecules/CreateCompanyModal';
import { useAuth } from '../hooks/use-auth/use-auth';
import { CompanyService } from '../services/company-service';

type CompanySetupProviderProps = PropsWithChildren;

const SKIP_COMPANY_SETUP_KEY = 'skipCompanySetup';
const SKIP_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const CompanySetupProvider = ({
  children,
}: CompanySetupProviderProps) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isCheckingCompany, setIsCheckingCompany] = useState(false);

  useEffect(() => {
    const checkCompanySetup = async () => {
      // Only check if user is logged in
      if (!user) {
        setShowModal(false);
        return;
      }

      // Check if user has skipped recently
      const skipData = localStorage.getItem(SKIP_COMPANY_SETUP_KEY);
      if (skipData) {
        try {
          const { timestamp } = JSON.parse(skipData);
          const timeSinceSkip = Date.now() - timestamp;
          if (timeSinceSkip < SKIP_DURATION_MS) {
            // Still within skip period, don't show modal
            return;
          } else {
            // Skip period expired, remove the flag
            localStorage.removeItem(SKIP_COMPANY_SETUP_KEY);
          }
        } catch {
          // Invalid skip data, remove it
          localStorage.removeItem(SKIP_COMPANY_SETUP_KEY);
        }
      }

      // Check if user is a member of any company
      setIsCheckingCompany(true);
      try {
        const isMember = await CompanyService.isUserCompanyMember();
        if (!isMember) {
          // User is not a member of any company, show the modal
          setShowModal(true);
        }
      } catch {
        // Error checking company membership
      } finally {
        setIsCheckingCompany(false);
      }
    };

    void checkCompanySetup();
  }, [user]);

  const handleSkip = () => {
    // Store skip timestamp in localStorage
    localStorage.setItem(
      SKIP_COMPANY_SETUP_KEY,
      JSON.stringify({ timestamp: Date.now() }),
    );
    setShowModal(false);
  };

  const handleSuccess = () => {
    // Company created successfully, remove skip flag if it exists
    localStorage.removeItem(SKIP_COMPANY_SETUP_KEY);
    setShowModal(false);
  };

  const handleClose = () => {
    // User clicked X button, treat it as skip
    handleSkip();
  };

  return (
    <>
      {children}
      {!isCheckingCompany && (
        <CreateCompanyModal
          isOpen={showModal}
          onClose={handleClose}
          onSkip={handleSkip}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};
