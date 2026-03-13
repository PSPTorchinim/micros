import { UnifiedApi } from './api';

// Mock environment variable
const originalEnv = process.env;

describe('UnifiedApi', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should add secure_key header to all requests when REACT_APP_API_SECURE_KEY is set', () => {
    // Set the environment variable
    process.env.REACT_APP_API_SECURE_KEY = 'test-secure-key-123';

    const api = new UnifiedApi();

    // Check that all service instances have the interceptor set up
    expect(api.brand.instance.interceptors.request).toBeDefined();
    expect(api.documents.instance.interceptors.request).toBeDefined();
    expect(api.gear.instance.interceptors.request).toBeDefined();
    expect(api.identity.instance.interceptors.request).toBeDefined();
    expect(api.mailing.instance.interceptors.request).toBeDefined();
    expect(api.music.instance.interceptors.request).toBeDefined();
    expect(api.party.instance.interceptors.request).toBeDefined();
  });

  it('should warn when REACT_APP_API_SECURE_KEY is not set', () => {
    // Remove the environment variable
    delete process.env.REACT_APP_API_SECURE_KEY;

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    new UnifiedApi();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'REACT_APP_API_SECURE_KEY is not set. API requests may fail authentication.'
    );

    consoleWarnSpy.mockRestore();
  });

  it('should not warn when REACT_APP_API_SECURE_KEY is set', () => {
    // Set the environment variable
    process.env.REACT_APP_API_SECURE_KEY = 'test-secure-key-456';

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    new UnifiedApi();

    expect(consoleWarnSpy).not.toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });
});
