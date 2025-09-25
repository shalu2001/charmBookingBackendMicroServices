import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  async deleteFile(fileName: string): Promise<void> {
    const filePath = join(process.cwd(), 'uploads', fileName);

    try {
      await unlink(filePath);
      this.logger.log(`Deleted file: ${filePath}`);
    } catch (err) {
      this.logger.warn(`Could not delete file: ${filePath} - ${err.message}`);
    }
  }

  getFileUrl(fileName: string): string {
    return `/uploads/${fileName}`; // if serving static
  }

  getFileUrls(fileNames: string[]): string[] {
    return fileNames.map((fileName) => this.getFileUrl(fileName));
  }
}
