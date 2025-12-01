/**
 * Health controller tests
 */

import healthController from '../controllers/health';

describe('Health Controller', () => {
  let ctx: any;

  beforeEach(() => {
    // Mock Koa context
    ctx = {
      body: null,
      status: null,
    };

    // Mock process.uptime
    jest.spyOn(process, 'uptime').mockReturnValue(123.456);

    // Mock Date.now for consistent timestamp
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('check', () => {
    it('should return healthy status when successful', async () => {
      await healthController.check(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual({
        status: 'ok',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 123.456,
        environment: process.env.NODE_ENV || 'development',
      });
    });

    it('should include the current environment', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      await healthController.check(ctx);

      expect(ctx.body.environment).toBe('production');

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should default to development environment if NODE_ENV is not set', async () => {
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      await healthController.check(ctx);

      expect(ctx.body.environment).toBe('development');

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should return the current timestamp', async () => {
      await healthController.check(ctx);

      expect(ctx.body.timestamp).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should return the process uptime', async () => {
      await healthController.check(ctx);

      expect(ctx.body.uptime).toBe(123.456);
    });

    it('should handle errors and return 503 status', async () => {
      // Mock process.uptime to throw an error
      jest.spyOn(process, 'uptime').mockImplementation(() => {
        throw new Error('Test error');
      });

      await healthController.check(ctx);

      expect(ctx.status).toBe(503);
      expect(ctx.body).toEqual({
        status: 'error',
        timestamp: '2024-01-01T00:00:00.000Z',
        error: 'Test error',
      });
    });
  });
});
