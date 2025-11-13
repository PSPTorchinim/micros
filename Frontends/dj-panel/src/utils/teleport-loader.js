// Load teleport scripts and styles dynamically to avoid build-time localStorage issues
export const loadTeleportScripts = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://unpkg.com/@teleporthq/teleport-custom-scripts/dist/style.css';
    document.head.appendChild(link);

    // Load JavaScript
    const script = document.createElement('script');
    script.setAttribute('data-section-id', 'navbar');
    script.src = 'https://unpkg.com/@teleporthq/teleport-custom-scripts';
    document.head.appendChild(script);
  }
};

// Auto-load when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', loadTeleportScripts);
}
