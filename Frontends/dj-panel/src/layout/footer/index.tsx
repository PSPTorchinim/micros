import React from 'react';
import './index.css';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillMail,
  AiFillTikTok,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';

interface Link {
  href: string;
  text: string;
}

interface SocialLink {
  viewBox: string;
  iconPath: any;
  detail: string;
}

interface FooterProps {
  logoAlt: string;
  logoSrc: string;
  action1: string;
  content2: string;
  content3: string;
  privacyLink: string;
  termsLink: string;
  cookiesLink: string;
  socialLinkTitleCategory: string;
  links: { title: string; items: Link[] }[];
  socialLinks: SocialLink[];
  customStyles?: React.CSSProperties;
  additionalContent?: React.ReactNode;
}

export const Footer = (props: FooterProps) => {
  return (
    <footer className="footer thq-section-padding" style={props.customStyles}>
      <div className="footer-max-width thq-section-max-width">
        <div className="footer-content">
          <div className="footer-links">
            {props.links.map(
              (
                column: { title: string; items: Link[] },
                columnIndex: number,
              ) => (
                <div key={columnIndex} className="footer-column">
                  <strong className="thq-body-large footer-column-title">
                    {column.title}
                  </strong>
                  <div className="footer-footer-links">
                    {column.items.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        to={link.href}
                        rel="noreferrer noopener"
                        className="thq-body-small"
                      >
                        {link.text}
                      </Link>
                    ))}
                  </div>
                </div>
              ),
            )}
            <div className="footer-column">
              <strong className="thq-body-large footer-social-link-title">
                {props.socialLinkTitleCategory}
              </strong>
              <div className="footer-social-links">
                {props.socialLinks.map((link: SocialLink, index: number) => (
                  <div key={index} className="footer-link">
                    {link.iconPath({ className: 'thq-icon-small' })}
                    <span className="thq-body-small">{link.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-credits">
          <div className="thq-divider-horizontal"></div>
          <div className="footer-row">
            <span className="thq-body-small">{props.content3}</span>
            <div className="footer-footer-links3">
              <span className="thq-body-small">{props.privacyLink}</span>
              <span className="thq-body-small">{props.termsLink}</span>
              <span className="thq-body-small">{props.cookiesLink}</span>
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
  content3: '2025 DJ Beat Blaster. All Rights Reserved.',
  logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
  logoAlt: 'DJ Management Logo',
  socialLinkTitleCategory: 'Connect with Us',
  links: [
    {
      title: 'Company',
      items: [
        { href: '/home', text: 'Home' },
        { href: 'https://example.com', text: 'Services' },
        { href: 'https://example.com', text: 'About Us' },
        { href: 'https://example.com', text: 'Contact Us' },
        { href: 'https://example.com', text: 'Terms of Service' },
      ],
    },
    {
      title: 'Quick Links',
      items: [
        { href: 'https://example.com', text: 'Privacy Policy' },
        { href: 'https://example.com', text: 'Cookie Policy' },
        { href: 'https://example.com', text: 'Manage DJ Contracts' },
        { href: 'https://example.com', text: 'Manage Invoices' },
        { href: 'https://example.com', text: 'Manage Songs Requests' },
      ],
    },
  ],
  socialLinks: [
    {
      title: 'Email',
      content: 'Send us an email for any questions or concerns.',
      detail: 'contact@djbeatblaster.com',
      iconPath: AiFillMail,
    },
    {
      title: 'Facebook',
      content: 'Stay connected with us on Facebook.',
      detail: 'facebook.com/djbeatblaster2024',
      iconPath: AiFillFacebook,
    },
    {
      title: 'Instagram',
      content: 'Follow us on Instagram for the latest updates.',
      detail: 'instagram.com/dj.beat.blaster',
      iconPath: AiFillInstagram,
    },
    {
      title: 'Instagram',
      content: 'Follow us on Instagram for the latest updates.',
      detail: 'instagram.com/dj.beat.blaster',
      iconPath: AiFillTikTok,
    },
  ],
};
