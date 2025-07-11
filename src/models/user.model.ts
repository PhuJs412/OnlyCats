export interface User {
  id: string;
  username: string;
  email: string;
  password: string;

  bio?: string | null;
  gender?: string | null;
  dob?: string | null;

  is_private?: boolean | null;
  is_verified?: boolean | null;

  last_login_at?: string | null;

  otp_code?: string | null;
  otp_expired_at?: string | null;

  failed_login_attempt?: number | null;
  last_failed_attempt?: string | null;

  is_locked?: boolean | null;
  locked_at?: string | null;

  avatar_url?: string | null;
  background_url?: string | null;

  is_abandoned?: boolean | null;
  is_deleted?: boolean | null;

  created_at?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
}
