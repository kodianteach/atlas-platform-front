/**
 * Save Admin Profile Use Case
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AdminGateway } from '@domain/gateways/admin/admin.gateway';
import { AdminProfile, ProfileSetupData } from '@domain/models/admin/admin-profile.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class SaveProfileUseCase {
  private readonly adminGateway = inject(AdminGateway);

  execute(data: ProfileSetupData): Observable<Result<AdminProfile>> {
    return this.adminGateway.saveProfile(data).pipe(
      catchError(error => of(failure<AdminProfile>({
        code: 'SAVE_PROFILE_ERROR',
        message: error.message || 'Error saving profile',
        timestamp: new Date()
      })))
    );
  }
}
