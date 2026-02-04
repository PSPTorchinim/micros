import React from 'react';
import './index.css';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillMail,
  AiFillTikTok,
  AiFillTwitterCircle,
  AiFillYoutube,
  AiFillSound,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import type {
  Footer as FooterData,
  FooterLinkColumnComponent,
  FooterSocialLinkComponent,
} from '../../../models/api/strapi/apiMap';

export interface FooterProps {
  footerData: FooterData | null;
  customStyles?: React.CSSProperties;
  additionalContent?: React.ReactNode;
}

// Map icon names to React Icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: AiFillInstagram,
  facebook: AiFillFacebook,
  twitter: AiFillTwitterCircle,
  youtube: AiFillYoutube,
  mail: AiFillMail,
  email: AiFillMail,
  tiktok: AiFillTikTok,
  soundcloud: AiFillSound,
  headphones: AiFillSound,
};

export const Footer = (props: FooterProps) => {
  if (!props.footerData) {
    return null;
  }

  const { footerData } = props;

  // Get icon component from icon name
  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return AiFillMail;
    const normalizedName = iconName.toLowerCase();
    return iconMap[normalizedName] || AiFillMail;
  };

  // Filter columns that have links
  const columns =
    footerData.columns?.filter(
      (column) => column.links && column.links.length > 0,
    ) ?? [];

  return (
    <footer className="footer thq-section-padding" style={props.customStyles}>
      <div className="footer-max-width thq-section-max-width">
        <div className="footer-content">
          <div className="footer-links">
            {columns.map((column: FooterLinkColumnComponent) => (
              <div key={column.title ?? column.id} className="footer-column">
                <strong className="thq-body-large footer-column-title">
                  {column.title ?? ''}
                </strong>
                <div className="footer-footer-links">
                  {column.links?.map((link) => (
                    <Link
                      key={`${link.url}-${link.label}`}
                      to={link.url ?? '#'}
                      rel="noreferrer noopener"
                      className="thq-body-small"
                    >
                      {link.label ?? ''}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {footerData.socialLinks && footerData.socialLinks.length > 0 && (
              <div className="footer-column">
                <strong className="thq-body-large footer-social-link-title">
                  Connect with Us
                </strong>
                <div className="footer-social-links">
                  {footerData.socialLinks.map(
                    (link: FooterSocialLinkComponent) => {
                      const IconComponent = getIconComponent(
                        link.icon ?? link.platform,
                      );
                      return (
                        <div
                          key={`${link.platform}-${link.url ?? link.detail}`}
                          className="footer-link"
                        >
                          <IconComponent className="thq-icon-small" />
                          <span className="thq-body-small">
                            {link.detail ?? link.url ?? ''}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="footer-credits">
          <div className="thq-divider-horizontal"></div>
          <div className="footer-row">
            <span className="thq-body-small">
              {footerData.copyright ??
                '© 2024 DJ Beat Blaster. All rights reserved.'}
            </span>
            <div className="footer-footer-links3">
              <span className="thq-body-small">Privacy Policy</span>
              <span className="thq-body-small">Terms of Service</span>
              <span className="thq-body-small">Cookie Policy</span>
            </div>
          </div>
        </div>
        {props.additionalContent && (
          <div className="footer-additional-content">
            {props.additionalContent}
          </div>
        )}
      </div>
    </footer>
  );
};

Footer.defaultProps = {
  footerData: null,
};
