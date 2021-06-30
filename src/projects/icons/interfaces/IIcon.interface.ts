export interface IIcon {
  _id?: string;
  name: string;
  versionMajor: number;
  versionMinor: number;

  // aws specific
  originalname: string;
  encoding: string;
  mimetype: string;
  ACL: string;
  ETag: string;
  Location: string;
  Key: string;
  Bucket: string;
  width: number;
  height: number;
  premultiplied: boolean;
  size: number;
  ContentType: string;
}
