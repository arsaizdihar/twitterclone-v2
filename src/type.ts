export interface ISimpleUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  private: boolean;
  verified: boolean;
  photoUrl: string | null;
}
