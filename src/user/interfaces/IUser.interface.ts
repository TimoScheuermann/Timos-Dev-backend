export interface IUser {
  _id?: string;
  thirdPartyId: string;
  group: string;
  provider: string;
  username: string;
  avatar: string;
  firstLogin: number;
  lastLogin: number;
}
