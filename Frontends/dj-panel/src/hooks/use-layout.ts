import { useState, useEffect } from 'react';
import { useServices } from './use-services';

export const useLayoutData = () => {
  const [navigation, setNavigation] = useState<any>(null);
  const [footer, setFooter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { contentService } = useServices();

  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        setLoading(true);

        const [navigationData, footerData] = await Promise.all([
          contentService.getNavigationData(),
          contentService.getFooterData(),
        ]);

        setNavigation(navigationData);
        setFooter(footerData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch layout data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch layout data',
        );

        // Set fallback data
        setNavigation({
          links: [{ text: 'Home', url: '/' }],
          logo: { text: 'DJ Panel', url: '/' },
        });

        setFooter({
          links: [],
          copyright: '© 2024 DJ Beat Blaster. All rights reserved.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLayoutData();
  }, [contentService]);

  return { navigation, footer, loading, error };
};
