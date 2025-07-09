export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  gender?: string;
  dob?: Date;
  is_private?: boolean;
  is_verified?: boolean;
  last_login_at?: Date;
  avatar_url?: string;
  background_url?: string;
  is_abandoned?: boolean;
  is_deleted?: boolean;
  created_at?: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
}
