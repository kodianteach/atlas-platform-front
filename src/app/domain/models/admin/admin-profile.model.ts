/**
 * Admin profile models
 */

export interface AdminProfile {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  adminId: string;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileSetupData {
  fullName: string;
  phoneNumber: string;
  adminId: string;
}

export interface ProfileSetupRequest {
  fullName: string;
  phoneNumber: string;
  adminId: string;
}

export interface ProfileSetupResponse {
  success: boolean;
  profile?: AdminProfile;
  error?: string;
}
