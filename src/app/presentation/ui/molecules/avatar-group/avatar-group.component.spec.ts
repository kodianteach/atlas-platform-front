import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarGroupComponent } from './avatar-group.component';
import { User } from '../../../models/announcement.model';

describe('AvatarGroupComponent', () => {
  let component: AvatarGroupComponent;
  let fixture: ComponentFixture<AvatarGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('visibleUsers getter', () => {
    it('should return all users when count is less than maxVisible', () => {
      const users: User[] = [
        { id: '1', name: 'User 1', avatarUrl: 'url1' },
        { id: '2', name: 'User 2', avatarUrl: 'url2' },
        { id: '3', name: 'User 3', avatarUrl: 'url3' }
      ];
      component.users = users;
      component.maxVisible = 4;

      expect(component.visibleUsers.length).toBe(3);
      expect(component.visibleUsers).toEqual(users);
    });

    it('should return only maxVisible users when count exceeds maxVisible', () => {
      const users: User[] = [
        { id: '1', name: 'User 1', avatarUrl: 'url1' },
        { id: '2', name: 'User 2', avatarUrl: 'url2' },
        { id: '3', name: 'User 3', avatarUrl: 'url3' },
        { id: '4', name: 'User 4', avatarUrl: 'url4' },
        { id: '5', name: 'User 5', avatarUrl: 'url5' }
      ];
      component.users = users;
      component.maxVisible = 4;

      expect(component.visibleUsers.length).toBe(4);
      expect(component.visibleUsers).toEqual(users.slice(0, 4));
    });

    it('should return empty array when users is empty', () => {
      component.users = [];
      component.maxVisible = 4;

      expect(component.visibleUsers.length).toBe(0);
      expect(component.visibleUsers).toEqual([]);
    });
  });

  describe('remainingCount getter', () => {
    it('should return 0 when user count is less than maxVisible', () => {
      const users: User[] = [
        { id: '1', name: 'User 1', avatarUrl: 'url1' },
        { id: '2', name: 'User 2', avatarUrl: 'url2' }
      ];
      component.users = users;
      component.maxVisible = 4;

      expect(component.remainingCount).toBe(0);
    });

    it('should return 0 when user count equals maxVisible', () => {
      const users: User[] = [
        { id: '1', name: 'User 1', avatarUrl: 'url1' },
        { id: '2', name: 'User 2', avatarUrl: 'url2' },
        { id: '3', name: 'User 3', avatarUrl: 'url3' },
        { id: '4', name: 'User 4', avatarUrl: 'url4' }
      ];
      component.users = users;
      component.maxVisible = 4;

      expect(component.remainingCount).toBe(0);
    });

    it('should return correct count when users exceed maxVisible', () => {
      const users: User[] = [
        { id: '1', name: 'User 1', avatarUrl: 'url1' },
        { id: '2', name: 'User 2', avatarUrl: 'url2' },
        { id: '3', name: 'User 3', avatarUrl: 'url3' },
        { id: '4', name: 'User 4', avatarUrl: 'url4' },
        { id: '5', name: 'User 5', avatarUrl: 'url5' },
        { id: '6', name: 'User 6', avatarUrl: 'url6' }
      ];
      component.users = users;
      component.maxVisible = 4;

      expect(component.remainingCount).toBe(2);
    });

    it('should return 0 when users array is empty', () => {
      component.users = [];
      component.maxVisible = 4;

      expect(component.remainingCount).toBe(0);
    });
  });

  describe('groupClick event', () => {
    it('should emit groupClick event when onGroupClick is called', () => {
      spyOn(component.groupClick, 'emit');
      
      component.onGroupClick();

      expect(component.groupClick.emit).toHaveBeenCalledWith();
    });

    it('should emit groupClick event when clicked', () => {
      spyOn(component.groupClick, 'emit');
      const compiled = fixture.nativeElement as HTMLElement;
      const avatarGroup = compiled.querySelector('.avatar-group') as HTMLElement;

      avatarGroup.click();

      expect(component.groupClick.emit).toHaveBeenCalled();
    });

    it('should emit groupClick event when Enter key is pressed', () => {
      spyOn(component.groupClick, 'emit');
      const compiled = fixture.nativeElement as HTMLElement;
      const avatarGroup = compiled.querySelector('.avatar-group') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      avatarGroup.dispatchEvent(event);

      expect(component.groupClick.emit).toHaveBeenCalled();
    });

    it('should emit groupClick event when Space key is pressed', () => {
      spyOn(component.groupClick, 'emit');
      const compiled = fixture.nativeElement as HTMLElement;
      const avatarGroup = compiled.querySelector('.avatar-group') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: ' ' });
      avatarGroup.dispatchEvent(event);

      expect(component.groupClick.emit).toHaveBeenCalled();
    });
  });

  describe('rendering', () => {
    it('should render correct number of avatars when users count is less than maxVisible', () => {
      const users: User[] = [
        { id: '1', name: 'User 1', avatarUrl: 'url1' },
        { id: '2', name: 'User 2', avatarUrl: 'url2' }
      ];
      component.users = users;
      component.maxVisible = 4;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const avatars = compiled.querySelectorAll('app-avatar');
      const remainingIndicator = compiled.querySelector('.remaining-indicator');

      expect(avatars.length).toBe(2);
      expect(remainingIndicator).toBeNull();
    });

    it('should render maxVisible avatars and remaining indicator when users exceed maxVisible', () => {
      const users: User[] = [
        { id: '1', name: 'User 1', avatarUrl: 'url1' },
        { id: '2', name: 'User 2', avatarUrl: 'url2' },
        { id: '3', name: 'User 3', avatarUrl: 'url3' },
        { id: '4', name: 'User 4', avatarUrl: 'url4' },
        { id: '5', name: 'User 5', avatarUrl: 'url5' },
        { id: '6', name: 'User 6', avatarUrl: 'url6' }
      ];
      component.users = users;
      component.maxVisible = 4;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const avatars = compiled.querySelectorAll('app-avatar');
      const remainingIndicator = compiled.querySelector('.remaining-indicator');
      const remainingCount = compiled.querySelector('.remaining-count');

      expect(avatars.length).toBe(4);
      expect(remainingIndicator).not.toBeNull();
      expect(remainingCount?.textContent?.trim()).toBe('+2');
    });

    it('should not render remaining indicator when user count equals maxVisible', () => {
      const users: User[] = [
        { id: '1', name: 'User 1', avatarUrl: 'url1' },
        { id: '2', name: 'User 2', avatarUrl: 'url2' },
        { id: '3', name: 'User 3', avatarUrl: 'url3' },
        { id: '4', name: 'User 4', avatarUrl: 'url4' }
      ];
      component.users = users;
      component.maxVisible = 4;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const avatars = compiled.querySelectorAll('app-avatar');
      const remainingIndicator = compiled.querySelector('.remaining-indicator');

      expect(avatars.length).toBe(4);
      expect(remainingIndicator).toBeNull();
    });

    it('should render nothing when users array is empty', () => {
      component.users = [];
      component.maxVisible = 4;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const avatars = compiled.querySelectorAll('app-avatar');
      const remainingIndicator = compiled.querySelector('.remaining-indicator');

      expect(avatars.length).toBe(0);
      expect(remainingIndicator).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('should have role="button" on avatar group', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const avatarGroup = compiled.querySelector('.avatar-group');

      expect(avatarGroup?.getAttribute('role')).toBe('button');
    });

    it('should have tabindex="0" for keyboard navigation', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const avatarGroup = compiled.querySelector('.avatar-group');

      expect(avatarGroup?.getAttribute('tabindex')).toBe('0');
    });
  });
});
