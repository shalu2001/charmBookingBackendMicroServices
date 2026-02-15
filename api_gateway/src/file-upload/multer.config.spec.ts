import { Test, TestingModule } from '@nestjs/testing';
import { basename } from 'path';

// Simple unit tests for our path traversal logic without testing multer internals
describe('Path Traversal Protection', () => {
  describe('filename sanitization logic', () => {
    const sanitizeFilename = (originalName: string): string => {
      // Check for path traversal attempts
      if (originalName.includes('../') || originalName.includes('..\\')) {
        throw new Error('Path traversal attempt detected in filename');
      }
      
      // Use basename to strip any directory paths and sanitize filename
      const sanitizedName = basename(originalName)
        .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
        .replace(/[<>:"/\\|?*]/g, '_') // Remove filesystem-dangerous chars
        .replace(/^\.+/, '') // Remove leading dots
        .replace(/[^a-zA-Z0-9.\-_\s]/g, '_') // Replace dangerous chars, keep spaces, underscores, hyphens
        .replace(/\s+/g, '_') // Convert spaces to underscores
        .substring(0, 100); // Limit length
      
      // Ensure we have a valid filename
      if (!sanitizedName || sanitizedName.trim() === '') {
        throw new Error('Invalid filename after sanitization');
      }
      
      return sanitizedName;
    };

    it('should sanitize normal filenames correctly', () => {
      const result = sanitizeFilename('test-image.jpg');
      expect(result).toBe('test-image.jpg');
    });

    it('should block path traversal attempts with ../', () => {
      expect(() => sanitizeFilename('../../../malicious.jpg'))
        .toThrow('Path traversal attempt detected');
    });

    it('should block path traversal attempts with ..\\', () => {
      expect(() => sanitizeFilename('..\\..\\malicious.jpg'))
        .toThrow('Path traversal attempt detected');
    });

    it('should sanitize dangerous filenames', () => {
      const result = sanitizeFilename('test<script>alert(1)</script>.jpg');
      expect(result).toBe('test_script_alert_1___script_.jpg');
    });

    it('should handle empty filenames after sanitization', () => {
      expect(() => sanitizeFilename('...'))
        .toThrow('Invalid filename after sanitization');
    });

    it('should preserve valid filenames with spaces and underscores', () => {
      const result = sanitizeFilename('my test file_v2.jpg');
      expect(result).toBe('my_test_file_v2.jpg');
    });

    it('should use basename to strip directory paths', () => {
      const result = sanitizeFilename('some/path/to/file.jpg');
      expect(result).toBe('file.jpg');
    });

    it('should limit filename length', () => {
      const longName = 'a'.repeat(150) + '.jpg';
      const result = sanitizeFilename(longName);
      expect(result.length).toBeLessThanOrEqual(100);
    });
  });
});