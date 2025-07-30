const deflate = require('../deflate');

describe('deflate.js', () => {
  describe('zip_deflate', () => {
    it('should compress simple string', () => {
      const input = 'Hello World';
      const result = deflate.zip_deflate(input, 9);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should compress empty string', () => {
      const result = deflate.zip_deflate('', 9);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should compress long string', () => {
      const longString = 'A'.repeat(1000);
      const result = deflate.zip_deflate(longString, 9);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle special characters', () => {
      const specialChars = 'Hello 世界! @#$%^&*()';
      const result = deflate.zip_deflate(specialChars, 9);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should work with different compression levels', () => {
      const input = 'Test string for compression';
      const level1 = deflate.zip_deflate(input, 1);
      const level9 = deflate.zip_deflate(input, 9);

      expect(level1).toBeDefined();
      expect(level9).toBeDefined();
      expect(typeof level1).toBe('string');
      expect(typeof level9).toBe('string');
    });
  });
});