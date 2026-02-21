import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminMessage } from '../models/admin-message.model';

@Injectable({
  providedIn: 'root'
})
export class AdminChatService {
  private messages: AdminMessage[] = [];

  constructor() {
    this.initializeMockMessages();
  }

  private initializeMockMessages(): void {
    const now = new Date();
    
    this.messages = [
      {
        id: '1',
        senderId: 'admin-001',
        senderName: 'Carlos Rodríguez',
        senderRole: 'admin',
        message: 'Buenos días. ¿Cómo va todo en la puerta oeste?',
        timestamp: new Date(now.getTime() - 3600000),
        read: true
      },
      {
        id: '2',
        senderId: 'doorman-001',
        senderName: 'Yo',
        senderRole: 'doorman',
        message: 'Todo tranquilo por ahora. Tuvimos 15 entradas esta mañana.',
        timestamp: new Date(now.getTime() - 3500000),
        read: true
      },
      {
        id: '3',
        senderId: 'admin-001',
        senderName: 'Carlos Rodríguez',
        senderRole: 'admin',
        message: 'Perfecto. Recuerda verificar las placas de los vehículos de servicio.',
        timestamp: new Date(now.getTime() - 3400000),
        read: true
      },
      {
        id: '4',
        senderId: 'doorman-001',
        senderName: 'Yo',
        senderRole: 'doorman',
        message: 'Entendido. Por cierto, hay un paquete grande para la unidad 205.',
        timestamp: new Date(now.getTime() - 3300000),
        read: true
      },
      {
        id: '5',
        senderId: 'admin-001',
        senderName: 'Carlos Rodríguez',
        senderRole: 'admin',
        message: 'Gracias por avisar. Ya contacté al residente.',
        timestamp: new Date(now.getTime() - 1800000),
        read: true
      },
      {
        id: '6',
        senderId: 'admin-001',
        senderName: 'Carlos Rodríguez',
        senderRole: 'admin',
        message: 'Necesito que me envíes el reporte de entradas de ayer cuando puedas.',
        timestamp: new Date(now.getTime() - 300000),
        read: false
      }
    ];
  }

  getMessages(): Observable<AdminMessage[]> {
    return of(this.messages);
  }

  sendMessage(message: string): Observable<AdminMessage> {
    const newMessage: AdminMessage = {
      id: Date.now().toString(),
      senderId: 'doorman-001',
      senderName: 'Yo',
      senderRole: 'doorman',
      message: message,
      timestamp: new Date(),
      read: true
    };
    
    this.messages.push(newMessage);
    return of(newMessage);
  }

  markAsRead(messageId: string): Observable<void> {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.read = true;
    }
    return of(void 0);
  }

  getUnreadCount(): Observable<number> {
    const unreadCount = this.messages.filter(m => !m.read && m.senderRole === 'admin').length;
    return of(unreadCount);
  }
}
