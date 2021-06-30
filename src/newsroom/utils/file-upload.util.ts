/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IUploadedFile } from '../interfaces/IUploadedFile.interface';

export function imageFileFilter(
  req: Request,
  file: IUploadedFile,
  callback: any,
): void {
  if (
    !file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|svg)$/)
  ) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
}
