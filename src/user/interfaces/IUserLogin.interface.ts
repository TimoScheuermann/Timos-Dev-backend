import { Provider } from 'src/auth/Provider.enum';

export interface IUserLogin {
  avatar: string;
  username: string;
  thirdPartyId: string;
  provider: Provider;
}
