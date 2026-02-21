/**
 * Admin Gateway - Abstract interface for admin profile operations
 */
import { Observable } from 'rxjs';
import { AdminProfile, ProfileSetupData } from '@domain/models/admin/admin-profile.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class AdminGateway {
  /**
   * Get the current admin profile
   */
  abstract getProfile(): Observable<Result<AdminProfile>>;

  /**
   * Save or update admin profile
   * @param data - Profile setup data
   */
  abstract saveProfile(data: ProfileSetupData): Observable<Result<AdminProfile>>;

  /**
   * Check if profile is complete
   */
  abstract isProfileComplete(): boolean;
}
