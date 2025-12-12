import React from 'react';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillMail,
  AiFillTikTok,
  AiFillTwitterCircle,
  AiFillYoutube,
  AiFillSoundCloud,
} from 'react-icons/ai';
import type { Footer } from '../models/strapi/strapiMap';

// Map icon names to React Icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: AiFillInstagram,
  facebook: AiFillFacebook,
  twitter: AiFillTwitterCircle,
  youtube: AiFillYoutube,
  mail: AiFillMail,
  email: AiFillMail,
  tiktok: AiFillTikTok,
  soundcloud: AiFillSoundCloud,
  headphones: AiFillSoundCloud,
};

export function mapFooterData(footerData: Footer | null) {
  if (!footerData) {
    return null;
  }

  // Map columns with links
  const links =
    footerData.columns?.map((column) => ({
      title: column.title || '',
      items:
        column.links?.map((link) => ({
          href: link.url || '#',
          text: link.label || '',
        })) || [],
    })) || [];

  // Map social links
  const socialLinks =
    footerData.socialLinks?.map((social) => {
      const iconName = (social.icon || social.platform || '').toLowerCase();
      const iconComponent = iconMap[iconName] || AiFillMail;

      return {
        viewBox: '0 0 1024 1024',
        iconPath: iconComponent,
        detail: social.detail || social.url || '',
      };
    }) || [];

  return {
    content3: footerData.copyright || '© 2024 DJ Beat Blaster. All rights reserved.',
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Management Logo',
    socialLinkTitleCategory: 'Connect with Us',
    links,
    socialLinks,
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Service',
    cookiesLink: 'Cookie Policy',
    action1: '',
    content2: '',
  };
}
