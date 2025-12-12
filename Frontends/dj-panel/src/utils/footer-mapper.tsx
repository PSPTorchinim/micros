import React from 'react';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillMail,
  AiFillTikTok,
  AiFillTwitterCircle,
  AiFillYoutube,
  AiFillSound,
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
  soundcloud: AiFillSound,
  headphones: AiFillSound,
};

export function mapFooterData(footerData: Footer | null) {
  if (!footerData) {
    console.log('[Footer Mapper] No footer data provided');
    return null;
  }

  console.log('[Footer Mapper] Received footer data:', footerData);

  // Map columns with links
  // Filter out columns that don't have links or have empty links arrays
  const links =
    footerData.columns
      ?.filter((column) => {
        const hasLinks = column.links && column.links.length > 0;
        console.log(`[Footer Mapper] Column "${column.title}" has links:`, hasLinks, column.links);
        return hasLinks;
      })
      .map((column) => ({
        title: column.title || '',
        items:
          column.links?.map((link) => ({
            href: link.url || '#',
            text: link.label || '',
          })) || [],
      })) || [];

  console.log('[Footer Mapper] Mapped links:', links);

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

  console.log('[Footer Mapper] Mapped social links:', socialLinks);

  const result = {
    content3:
      footerData.copyright || '© 2024 DJ Beat Blaster. All rights reserved.',
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

  console.log('[Footer Mapper] Final mapped result:', result);
  return result;
}
