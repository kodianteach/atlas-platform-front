import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import {
  AdminProfile,
  ProfileSetupRequest,
  ProfileSetupResponse
} from '../models/admin-profile.model';

@Injectable({ providedIn: 'root' })
export class AdminProfileService {
  private readonly PROFILE_ENDPOINT = '/api/admin/profile';
  private profileComplete$ = new BehaviorSubject<boolean>(false);
  private currentProfile$ = new BehaviorSubject<AdminProfile | null>(null);

  // Mock data storage
  private mockProfiles: Map<string, AdminProfile> = new Map();
  private currentUserId = 'user-001'; // Simulated current user
  private useMockData = true; // Toggle for mock vs real API

  constructor(private http: HttpClient) {
    this.initializeMockData();
    this.loadProfileState();
  }

  /**
   * Initialize mock data for testing
   */
  private initializeMockData(): void {
    // Sample admin profiles
    const sampleProfiles: AdminProfile[] = [
      {
        id: 'profile-001',
        userId: 'user-001',
        fullName: 'Marcus Aurelius',
        phoneNumber: '+1 (555) 123-4567',
        adminId: 'ID-883492',
        profileComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'profile-002',
        userId: 'user-002',
        fullName: 'Julia Domna',
        phoneNumber: '+52 55 1234 5678',
        adminId: 'ID-445821',
        profileComplete: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'profile-003',
        userId: 'user-003',
        fullName: 'Lucius Verus',
        phoneNumber: '+1 (555) 987-6543',
        adminId: 'ID-229384',
        profileComplete: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    sampleProfiles.forEach(profile => {
      this.mockProfiles.set(profile.userId, profile);
    });
  }

  /**
   * Check if profile is complete
   */
  isProfileComplete(): Observable<boolean> {
    return this.profileComplete$.asObservable();
  }

  /**
   * Get current profile completion state synchronously
   */
  getProfileCompleteState(): boolean {
    return this.profileComplete$.value;
  }

  /**
   * Get current admin profile
   */
  getProfile(): Observable<AdminProfile | null> {
    if (this.useMockData) {
      return this.getMockProfile();
    }

    return this.http.get<AdminProfile>(this.PROFILE_ENDPOINT).pipe(
      tap(profile => {
        this.currentProfile$.next(profile);
        this.updateProfileCompletionState(profile.profileComplete);
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  /**
   * Get mock profile data
   */
  private getMockProfile(): Observable<AdminProfile | null> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const profile = this.mockProfiles.get(this.currentUserId);
        if (profile) {
          this.currentProfile$.next(profile);
          this.updateProfileCompletionState(profile.profileComplete);
          return profile;
        }
        return null;
      })
    );
  }

  /**
   * Save profile setup data
   */
  saveProfile(data: ProfileSetupRequest): Observable<ProfileSetupResponse> {
    if (this.useMockData) {
      return this.saveMockProfile(data);
    }

    return this.http.post<ProfileSetupResponse>(this.PROFILE_ENDPOINT, data).pipe(
      tap(response => {
        if (response.success && response.profile) {
          this.currentProfile$.next(response.profile);
          this.updateProfileCompletionState(response.profile.profileComplete);
        }
      }),
      catchError(error => {
        return of({
          success: false,
          error: error.error?.message || 'Failed to save profile'
        });
      })
    );
  }

  /**
   * Save mock profile data
   */
  private saveMockProfile(data: ProfileSetupRequest): Observable<ProfileSetupResponse> {
    return of(null).pipe(
      delay(800),
      map(() => {
        // Check for duplicate admin ID
        const duplicate = Array.from(this.mockProfiles.values()).find(
          p => p.adminId === data.adminId && p.userId !== this.currentUserId
        );

        if (duplicate) {
          return {
            success: false,
            error: 'This Admin ID is already registered.'
          };
        }

        // Get existing profile or create new one
        const existingProfile = this.mockProfiles.get(this.currentUserId);
        const now = new Date().toISOString();

        const updatedProfile: AdminProfile = {
          id: existingProfile?.id || `profile-${Date.now()}`,
          userId: this.currentUserId,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          adminId: data.adminId,
          profileComplete: true,
          createdAt: existingProfile?.createdAt || now,
          updatedAt: now
        };

        this.mockProfiles.set(this.currentUserId, updatedProfile);
        this.currentProfile$.next(updatedProfile);
        this.updateProfileCompletionState(true);

        return {
          success: true,
          profile: updatedProfile
        };
      })
    );
  }

  /**
   * Update profile completion state
   */
  private updateProfileCompletionState(complete: boolean): void {
    this.profileComplete$.next(complete);
    // Persist to localStorage for quick access
    localStorage.setItem('profileComplete', String(complete));
  }

  /**
   * Load profile state from localStorage on service initialization
   */
  private loadProfileState(): void {
    const stored = localStorage.getItem('profileComplete');
    if (stored !== null) {
      this.profileComplete$.next(stored === 'true');
    }
  }
}
