export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  avatarUrl?: string | null;     // ← Allow both null and undefined
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}