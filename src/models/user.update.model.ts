export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  gender?: string;
  dob?: string;
  is_private?: boolean;
  is_verified?: boolean;
  last_login_at?: string;
  otp_code?: string;
  otp_expired_at?: string;
  failed_login_attempt?: number;
  last_failed_attempt?: string;
  is_locked?: boolean;
  locked_at?: string | null;
  avatar_url?: string;
  background_url?: string;
  is_abandoned?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}
