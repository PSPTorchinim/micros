import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentService } from '../../../services/content-service';

interface FooterData {
  id?: number;
  copyright?: string;
  sections?: Array<{
    title: string;
    links: Array<{
      text: string;
      url: string;
      external?: boolean;
      newTab?: boolean;
    }>;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon?: string;
  }>;
  bottomLinks?: Array<{
    text: string;
    url: string;
    external?: boolean;
    newTab?: boolean;
  }>;
}

export const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const data = await ContentService.getFooterData();
        setFooterData(data);
      } catch (err) {
        console.error('Failed to load footer data:', err);
        setError('Failed to load footer');
        // Set fallback data
        setFooterData({
          copyright: `© ${new Date().getFullYear()} DJ Panel. All rights reserved.`,
          sections: [],
          socialLinks: [],
          bottomLinks: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadFooterData();
  }, []);

  const renderLink = (
    link: { text: string; url: string; external?: boolean; newTab?: boolean },
    index: number,
  ) => {
    const commonProps = {
      key: index,
      className: 'footer-link',
    };

    if (link.external) {
      return (
        <a
          {...commonProps}
          href={link.url}
          target={link.newTab ? '_blank' : '_self'}
          rel={link.newTab ? 'noopener noreferrer' : undefined}
        >
          {link.text}
        </a>
      );
    }

    return (
      <Link {...commonProps} to={link.url}>
        {link.text}
      </Link>
    );
  };

  const renderSocialIcon = (platform: string, customIcon?: string) => {
    if (customIcon) {
      // Check if it's HTML (contains img tag)
      if (customIcon.includes('<img')) {
        return <span dangerouslySetInnerHTML={{ __html: customIcon }} />;
      }
      return customIcon;
    }

    const icons: { [key: string]: string } = {
      facebook: '📘',
      twitter: '🐦',
      instagram: '📷',
      linkedin: '💼',
      youtube: '📺',
      tiktok: '🎵',
      spotify: '🎵',
      soundcloud: '🔊',
      discord: '💬',
    };
    return icons[platform.toLowerCase()] || '🔗';
  };

  if (loading) {
    return (
      <footer className="footer footer-loading">
        <div className="footer-container">
          <div className="loading-spinner">Loading footer...</div>
        </div>
      </footer>
    );
  }

  if (error && !footerData) {
    return (
      <footer className="footer footer-error">
        <div className="footer-container">
          <p>Unable to load footer content</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Dynamic Footer Sections */}
          {footerData?.sections?.map((section, index) => (
            <div key={index} className="footer-section">
              <h3 className="footer-section-title">{section.title}</h3>
              <ul className="footer-links">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="footer-link-item">
                    {renderLink(link, linkIndex)}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links Section */}
          {footerData?.socialLinks && footerData.socialLinks.length > 0 && (
            <div className="footer-section social-section">
              <h3 className="footer-section-title">Follow Us</h3>
              <div className="social-links">
                {footerData.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    title={social.platform}
                  >
                    <span className="social-icon">
                      {renderSocialIcon(social.platform, social.icon)}
                    </span>
                    <span className="social-platform">{social.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            {/* Copyright */}
            <div className="footer-copyright">
              {footerData?.copyright ||
                `© ${new Date().getFullYear()} DJ Panel. All rights reserved.`}
            </div>

            {/* Bottom Links */}
            {footerData?.bottomLinks && footerData.bottomLinks.length > 0 && (
              <div className="footer-bottom-links">
                {footerData.bottomLinks.map((link, index) => (
                  <span key={index} className="footer-bottom-link-wrapper">
                    {renderLink(link, index)}
                    {index < footerData.bottomLinks!.length - 1 && (
                      <span className="link-separator"> | </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
