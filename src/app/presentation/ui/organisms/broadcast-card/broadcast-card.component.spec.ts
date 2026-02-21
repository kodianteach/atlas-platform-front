import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BroadcastCardComponent } from './broadcast-card.component';
import { BroadcastMessage } from '../../../models/announcement.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('BroadcastCardComponent', () => {
  let component: BroadcastCardComponent;
  let fixture: ComponentFixture<BroadcastCardComponent>;

  const mockBroadcast: BroadcastMessage = {
    id: '1',
    type: 'broadcast',
    createdAt: new Date('2024-01-15T10:30:00'),
    priority: 1,
    title: 'Important Community Update',
    description: 'This is a detailed description of the community update that provides more information.',
    previewText: 'This is a preview of the community update.',
    isUrgent: true,
    backgroundColor: '#FFE5E5',
    relatedUsers: [
      { id: '1', name: 'John Doe', avatarUrl: 'https://example.com/avatar1.jpg' },
      { id: '2', name: 'Jane Smith', avatarUrl: 'https://example.com/avatar2.jpg' }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BroadcastCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.broadcast = mockBroadcast;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      component.broadcast = mockBroadcast;
      fixture.detectChanges();
    });

    it('should apply backgroundColor from broadcast', () => {
      const cardElement: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card');
      expect(cardElement.style.backgroundColor).toBe('rgb(255, 229, 229)'); // #FFE5E5 in RGB
    });

    it('should display urgent badge when isUrgent is true', () => {
      const badge = fixture.debugElement.query(By.css('app-badge'));
      expect(badge).toBeTruthy();
    });

    it('should not display urgent badge when isUrgent is false', () => {
      component.broadcast = { ...mockBroadcast, isUrgent: false };
      fixture.detectChanges();
      
      const badge = fixture.debugElement.query(By.css('app-badge'));
      expect(badge).toBeFalsy();
    });

    it('should display timestamp', () => {
      const timestamp = fixture.debugElement.query(By.css('app-timestamp-display'));
      expect(timestamp).toBeTruthy();
    });

    it('should display title', () => {
      const title: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card__title');
      expect(title.textContent).toBe('Important Community Update');
    });

    it('should display preview text', () => {
      const preview: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card__preview');
      expect(preview.textContent).toBe('This is a preview of the community update.');
    });

    it('should display avatar group', () => {
      const avatarGroup = fixture.debugElement.query(By.css('app-avatar-group'));
      expect(avatarGroup).toBeTruthy();
    });

    it('should pass relatedUsers to avatar group', () => {
      const avatarGroup = fixture.debugElement.query(By.css('app-avatar-group'));
      expect(avatarGroup.componentInstance.users).toEqual(mockBroadcast.relatedUsers);
    });

    it('should display Read More button', () => {
      const button: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card__read-more');
      expect(button).toBeTruthy();
      expect(button.textContent?.trim()).toBe('Read More');
    });

    it('should have role="article" for accessibility', () => {
      const card: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card');
      expect(card.getAttribute('role')).toBe('article');
    });

    it('should have aria-label for accessibility', () => {
      const card: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card');
      expect(card.getAttribute('aria-label')).toBe('Broadcast: Important Community Update');
    });
  });

  describe('Events', () => {
    beforeEach(() => {
      component.broadcast = mockBroadcast;
      fixture.detectChanges();
    });

    it('should emit readMoreClick with broadcast id when Read More button is clicked', () => {
      spyOn(component.readMoreClick, 'emit');
      
      const button: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card__read-more');
      button.click();
      
      expect(component.readMoreClick.emit).toHaveBeenCalledWith('1');
    });

    it('should call onReadMoreClick when button is clicked', () => {
      spyOn(component, 'onReadMoreClick');
      
      const button: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card__read-more');
      button.click();
      
      expect(component.onReadMoreClick).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle broadcast with no related users', () => {
      const broadcastNoUsers: BroadcastMessage = {
        ...mockBroadcast,
        relatedUsers: []
      };
      component.broadcast = broadcastNoUsers;
      fixture.detectChanges();
      
      const avatarGroup = fixture.debugElement.query(By.css('app-avatar-group'));
      expect(avatarGroup).toBeTruthy();
      expect(avatarGroup.componentInstance.users).toEqual([]);
    });

    it('should handle broadcast with many related users', () => {
      const manyUsers = Array.from({ length: 10 }, (_, i) => ({
        id: `user-${i}`,
        name: `User ${i}`,
        avatarUrl: `https://example.com/avatar${i}.jpg`
      }));
      
      const broadcastManyUsers: BroadcastMessage = {
        ...mockBroadcast,
        relatedUsers: manyUsers
      };
      component.broadcast = broadcastManyUsers;
      fixture.detectChanges();
      
      const avatarGroup = fixture.debugElement.query(By.css('app-avatar-group'));
      expect(avatarGroup.componentInstance.users.length).toBe(10);
      expect(avatarGroup.componentInstance.maxVisible).toBe(4);
    });

    it('should handle long title text', () => {
      const longTitle = 'A'.repeat(200);
      component.broadcast = { ...mockBroadcast, title: longTitle };
      fixture.detectChanges();
      
      const title: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card__title');
      expect(title.textContent).toBe(longTitle);
    });

    it('should handle long preview text', () => {
      const longPreview = 'B'.repeat(500);
      component.broadcast = { ...mockBroadcast, previewText: longPreview };
      fixture.detectChanges();
      
      const preview: HTMLElement = fixture.nativeElement.querySelector('.broadcast-card__preview');
      expect(preview.textContent).toBe(longPreview);
    });
  });
});
