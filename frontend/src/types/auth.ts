export interface User {
  id: string;
  email: string;
  display_name: string;
}

export interface TokenResponse {
  token: string;
  user: User;
}
