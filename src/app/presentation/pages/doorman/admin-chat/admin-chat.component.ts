import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminChatService } from '../../../../services/admin-chat.service';
import { AdminMessage } from '../../../../models/admin-message.model';
import { DoormanBottomNavComponent } from '../../../ui/organisms/doorman-bottom-nav/doorman-bottom-nav.component';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, DoormanBottomNavComponent],
  templateUrl: './admin-chat.component.html',
  styleUrl: './admin-chat.component.css'
})
export class AdminChatComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  messages: AdminMessage[] = [];
  newMessage: string = '';
  sending: boolean = false;

  constructor(
    private adminChatService: AdminChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadMessages(): void {
    this.adminChatService.getMessages().subscribe(messages => {
      this.messages = messages;
      this.markUnreadAsRead();
    });
  }

  markUnreadAsRead(): void {
    this.messages
      .filter(m => !m.read && m.senderRole === 'admin')
      .forEach(m => {
        this.adminChatService.markAsRead(m.id).subscribe();
      });
  }

  onSendMessage(): void {
    if (this.newMessage.trim() && !this.sending) {
      this.sending = true;
      
      this.adminChatService.sendMessage(this.newMessage.trim()).subscribe(message => {
        this.messages.push(message);
        this.newMessage = '';
        this.sending = false;
        this.scrollToBottom();
      });
    }
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  onBack(): void {
    this.router.navigate(['/doorman/entry-control']);
  }

  formatTime(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    
    return messageDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    const messageDate = new Date(date);
    return messageDate.toDateString() === today.toDateString();
  }

  getDateLabel(date: Date): string {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return messageDate.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  shouldShowDateSeparator(index: number): boolean {
    if (index === 0) return true;
    
    const currentDate = new Date(this.messages[index].timestamp).toDateString();
    const previousDate = new Date(this.messages[index - 1].timestamp).toDateString();
    
    return currentDate !== previousDate;
  }
}
