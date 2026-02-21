/**
 * Admin Adapter - Implements AdminGateway for admin profile management
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AdminGateway } from '@domain/gateways/admin/admin.gateway';
import { AdminProfile, ProfileSetupData } from '@domain/models/admin/admin-profile.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AdminAdapter extends AdminGateway {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageGateway);

  private readonly PROFILE_ENDPOINT = `${environment.apiUrl}/admin/profile`;
  private readonly PROFILE_COMPLETE_KEY = 'profileComplete';

  private readonly profileComplete$ = new BehaviorSubject<boolean>(false);

  constructor() {
    super();
    this.loadProfileState();
  }

  override getProfile(): Observable<Result<AdminProfile>> {
    return this.http.get<AdminProfile>(this.PROFILE_ENDPOINT).pipe(
      tap(profile => {
        this.profileComplete$.next(profile.profileComplete);
        this.storage.setItem(this.PROFILE_COMPLETE_KEY, profile.profileComplete);
      }),
      map(profile => success(profile)),
      catchError(error => of(failure<AdminProfile>({
        code: 'GET_PROFILE_ERROR',
        message: error.message || 'Error loading profile',
        timestamp: new Date()
      })))
    );
  }

  override saveProfile(data: ProfileSetupData): Observable<Result<AdminProfile>> {
    return this.http.post<{ success: boolean; profile?: AdminProfile; error?: string }>(
      this.PROFILE_ENDPOINT, data
    ).pipe(
      map(response => {
        if (response.success && response.profile) {
          this.profileComplete$.next(true);
          this.storage.setItem(this.PROFILE_COMPLETE_KEY, true);
          return success(response.profile, 'Profile saved successfully');
        }
        return failure<AdminProfile>({
          code: 'SAVE_PROFILE_ERROR',
          message: response.error || 'Error saving profile',
          timestamp: new Date()
        });
      }),
      catchError(error => of(failure<AdminProfile>({
        code: 'SAVE_PROFILE_ERROR',
        message: error.message || 'Error saving profile',
        timestamp: new Date()
      })))
    );
  }

  override isProfileComplete(): boolean {
    return this.profileComplete$.value;
  }

  /**
   * Observable stream of profile completion state
   */
  isProfileComplete$(): Observable<boolean> {
    return this.profileComplete$.asObservable();
  }

  private loadProfileState(): void {
    const stored = this.storage.getItem<boolean>(this.PROFILE_COMPLETE_KEY);
    if (stored !== null) {
      this.profileComplete$.next(stored);
    }
  }
}
