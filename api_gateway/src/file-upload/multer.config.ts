import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import { FileTypeValidatorService, FileCategory } from './file-type-validator.service';

// Create a singleton instance for validation
const fileTypeValidator = new FileTypeValidatorService();

/**
 * Enhanced file filter that validates both extension and MIME type through magic bytes
 * @param allowedCategories - Array of allowed file categories
 * @param maxFileSize - Maximum file size in bytes
 */
const createSecureFileFilter = (allowedCategories: FileCategory[], maxFileSize?: number) => {
  return async (req: any, file: any, callback: any) => {
    try {
      // Basic filename validation
      if (!file.originalname || file.originalname.trim() === '') {
        return callback(new Error('Invalid filename provided'), false);
      }

      // Check file extension as first line of defense
      const supportedExtensions = fileTypeValidator.getSupportedExtensions(allowedCategories);
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      
      if (!fileExtension || !supportedExtensions.includes(fileExtension)) {
        const message = `Invalid file extension. ${fileTypeValidator.getUnsupportedFileMessage(allowedCategories)}`;
        return callback(new Error(message), false);
      }

      // Store categories for later validation in the request
      req.allowedFileCategories = allowedCategories;
      
      // Let multer continue - we'll validate magic bytes in the controller
      callback(null, true);
    } catch (error) {
      callback(new Error(`File validation failed: ${error.message}`), false);
    }
  };
};

/**
 * Secure storage configuration with sanitized filenames
 */
const secureStorage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    try {
      // Check for path traversal attempts
      if (file.originalname.includes('../') || file.originalname.includes('..\\')) {
        return cb(new Error('Path traversal attempt detected in filename'), '');
      }
      
      // Use basename to strip any directory paths and sanitize filename
      const sanitizedName = basename(file.originalname)
        .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
        .replace(/[<>:"/\\|?*]/g, '_') // Remove filesystem-dangerous chars
        .replace(/^\.+/, '') // Remove leading dots
        .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace remaining special chars
        .substring(0, 100); // Limit length
      
      // Ensure we have a valid filename
      if (!sanitizedName || sanitizedName.trim() === '') {
        return cb(new Error('Invalid filename after sanitization'), '');
      }
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(sanitizedName);
      
      cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    } catch (error) {
      cb(new Error(`Filename generation failed: ${error.message}`), '');
    }
  },
});

export const multerConfig = {
  storage: secureStorage,
  fileFilter: createSecureFileFilter([FileCategory.IMAGE]),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10, // Maximum number of files
    fieldNameSize: 100, // Maximum field name size
    fieldSize: 1024 * 1024, // Maximum field value size (1MB)
  },
};

export const salonDocumentsMulterConfig = {
  storage: secureStorage,
  fileFilter: createSecureFileFilter([FileCategory.DOCUMENT]),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 5, // Maximum number of files
    fieldNameSize: 100, // Maximum field name size
    fieldSize: 1024 * 1024, // Maximum field value size (1MB)
  },
};

// Export the validator service for use in controllers
export { FileTypeValidatorService, FileCategory };
