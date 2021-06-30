import { extname } from 'path';
import { v4 } from 'uuid';

export function renameFile(req, file, cb): void {
  cb(null, v4().split('-').join('') + extname(file.originalname));
}
