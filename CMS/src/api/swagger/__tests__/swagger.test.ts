/**
 * Swagger controller tests
 */

import swaggerController from '../controllers/swagger';
import fs from 'fs';

// Mock fs module
jest.mock('fs');

describe('Swagger Controller', () => {
  let ctx: any;
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    // Mock Koa context
    ctx = {
      body: null,
      status: null,
      type: null,
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('getSpec', () => {
    it('should return swagger specification when file exists', async () => {
      const mockSpec = {
        openapi: '3.0.0',
        info: {
          title: 'CMS API',
          version: '1.0.0',
        },
        paths: {},
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSpec));

      await swaggerController.getSpec(ctx);

      expect(ctx.body).toEqual(mockSpec);
      expect(ctx.type).toBe('application/json');
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining('full_documentation.json')
      );
      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('full_documentation.json'),
        'utf8'
      );
    });

    it('should return 404 when specification file does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false);

      await swaggerController.getSpec(ctx);

      expect(ctx.status).toBe(404);
      expect(ctx.body).toEqual({
        error: 'Swagger specification not found',
      });
      expect(mockFs.existsSync).toHaveBeenCalled();
      expect(mockFs.readFileSync).not.toHaveBeenCalled();
    });

    it('should return 500 when file read fails', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      await swaggerController.getSpec(ctx);

      expect(ctx.status).toBe(500);
      expect(ctx.body).toEqual({
        error: 'Failed to load swagger specification',
      });
    });

    it('should return 500 when JSON parsing fails', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('invalid json{');

      await swaggerController.getSpec(ctx);

      expect(ctx.status).toBe(500);
      expect(ctx.body).toEqual({
        error: 'Failed to load swagger specification',
      });
    });

    it('should use correct file path for specification', async () => {
      const mockSpec = { openapi: '3.0.0' };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockSpec));

      await swaggerController.getSpec(ctx);

      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringMatching(/extensions\/documentation\/documentation\/1\.0\.0\/full_documentation\.json$/)
      );
    });
  });
});
