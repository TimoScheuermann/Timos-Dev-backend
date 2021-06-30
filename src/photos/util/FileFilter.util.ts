import { Request } from 'express';
import { extname } from 'path';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export function fileFilter(
  _req: Request,
  file: UploadedFile,
  callback: (error: Error, acceptFile: boolean) => void,
): void {
  const fileTypes = /png|jpeg|jpg|webp|gif|svg/;
  const extName = fileTypes.test(extname(file.originalname.toLowerCase()));
  const mimeType = fileTypes.test(file.mimetype);
  if (extName && mimeType) {
    callback(null, true);
  } else {
    callback(new Error('Error: only ' + fileTypes + ' are allowed!'), false);
  }
}
