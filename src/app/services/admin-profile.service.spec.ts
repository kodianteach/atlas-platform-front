import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminProfileService } from './admin-profile.service';
import { AdminProfile, ProfileSetupRequest, ProfileSetupResponse } from '../models/admin-profile.model';

describe('AdminProfileService', () => {
  let service: AdminProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminProfileService]
    });
    
    service = TestBed.inject(AdminProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isProfileComplete', () => {
    it('should return observable of profile completion state', (done) => {
      service.isProfileComplete().subscribe(isComplete => {
        expect(typeof isComplete).toBe('boolean');
        done();
      });
    });

    it('should return false initially when no state is stored', (done) => {
      service.isProfileComplete().subscribe(isComplete => {
        expect(isComplete).toBe(false);
        done();
      });
    });
  });

  describe('getProfileCompleteState', () => {
    it('should return current profile completion state synchronously', () => {
      const state = service.getProfileCompleteState();
      expect(typeof state).toBe('boolean');
    });
  });

  describe('getProfile', () => {
    it('should fetch admin profile from API', () => {
      const mockProfile: AdminProfile = {
        id: '1',
        userId: 'user-1',
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        adminId: 'ADMIN-001',
        profileComplete: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      service.getProfile().subscribe(profile => {
        expect(profile).toEqual(mockProfile);
      });

      const req = httpMock.expectOne('/api/admin/profile');
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });

    it('should update profile completion state when profile is fetched', (done) => {
      const mockProfile: AdminProfile = {
        id: '1',
        userId: 'user-1',
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        adminId: 'ADMIN-001',
        profileComplete: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      service.getProfile().subscribe(() => {
        service.isProfileComplete().subscribe(isComplete => {
          expect(isComplete).toBe(true);
          done();
        });
      });

      const req = httpMock.expectOne('/api/admin/profile');
      req.flush(mockProfile);
    });

    it('should return null on error', () => {
      service.getProfile().subscribe(profile => {
        expect(profile).toBeNull();
      });

      const req = httpMock.expectOne('/api/admin/profile');
      req.error(new ProgressEvent('error'));
    });
  });

  describe('saveProfile', () => {
    it('should save profile data to API', () => {
      const profileData: ProfileSetupRequest = {
        fullName: 'Jane Smith',
        phoneNumber: '+1987654321',
        adminId: 'ADMIN-002'
      };

      const mockResponse: ProfileSetupResponse = {
        success: true,
        profile: {
          id: '2',
          userId: 'user-2',
          fullName: 'Jane Smith',
          phoneNumber: '+1987654321',
          adminId: 'ADMIN-002',
          profileComplete: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z'
        }
      };

      service.saveProfile(profileData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/admin/profile');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(profileData);
      req.flush(mockResponse);
    });

    it('should update profile completion state after successful save', (done) => {
      const profileData: ProfileSetupRequest = {
        fullName: 'Jane Smith',
        phoneNumber: '+1987654321',
        adminId: 'ADMIN-002'
      };

      const mockResponse: ProfileSetupResponse = {
        success: true,
        profile: {
          id: '2',
          userId: 'user-2',
          fullName: 'Jane Smith',
          phoneNumber: '+1987654321',
          adminId: 'ADMIN-002',
          profileComplete: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z'
        }
      };

      service.saveProfile(profileData).subscribe(() => {
        service.isProfileComplete().subscribe(isComplete => {
          expect(isComplete).toBe(true);
          expect(localStorage.getItem('profileComplete')).toBe('true');
          done();
        });
      });

      const req = httpMock.expectOne('/api/admin/profile');
      req.flush(mockResponse);
    });

    it('should handle save errors gracefully', () => {
      const profileData: ProfileSetupRequest = {
        fullName: 'Jane Smith',
        phoneNumber: '+1987654321',
        adminId: 'ADMIN-002'
      };

      service.saveProfile(profileData).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
      });

      const req = httpMock.expectOne('/api/admin/profile');
      req.error(new ProgressEvent('error'));
    });
  });

  describe('localStorage persistence', () => {
    it('should persist profile completion state to localStorage', (done) => {
      const mockProfile: AdminProfile = {
        id: '1',
        userId: 'user-1',
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        adminId: 'ADMIN-001',
        profileComplete: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      service.getProfile().subscribe(() => {
        expect(localStorage.getItem('profileComplete')).toBe('true');
        done();
      });

      const req = httpMock.expectOne('/api/admin/profile');
      req.flush(mockProfile);
    });

    it('should load profile completion state from localStorage on initialization', () => {
      localStorage.setItem('profileComplete', 'true');
      
      // Create new service instance to trigger loadProfileState
      const newService = new AdminProfileService(TestBed.inject(HttpClientTestingModule) as any);
      
      expect(newService.getProfileCompleteState()).toBe(true);
    });
  });
});
