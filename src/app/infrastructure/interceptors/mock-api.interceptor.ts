/**
 * Mock API Interceptor for development
 * Intercepts API calls and returns mock data
 */
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '@env/environment';

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ProfileData {
  fullName: string;
  phoneNumber: string;
  adminId: string;
}

const MOCK_USERS: MockUser[] = [
  { id: 'user-1', email: 'admin@atlas.com', name: 'Alice Anderson', role: 'admin' },
  { id: 'user-2', email: 'resident@atlas.com', name: 'Bob Builder', role: 'resident' }
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    type: 'broadcast',
    title: 'Bienvenido a Atlas Platform',
    description: '¡Estamos emocionados de tenerte aquí! Esta es la descripción completa del anuncio con más detalles sobre lo que está sucediendo en la comunidad.',
    previewText: '¡Estamos emocionados de tenerte aquí!',
    createdAt: new Date().toISOString(),
    isUrgent: true,
    backgroundColor: '#FFF0EB',
    priority: 10,
    relatedUsers: [
      { id: 'user1', name: 'John Doe', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
      { id: 'user2', name: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
      { id: 'user3', name: 'Bob Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=3' }
    ]
  },
  {
    id: '2',
    type: 'poll',
    title: '¿Qué función deberíamos construir a continuación?',
    question: 'Vota por tu función preferida',
    icon: '🚀',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    endsAt: new Date(Date.now() + 3600000).toISOString(),
    options: [
      { id: 'opt1', text: 'Modo Oscuro', votes: 15 },
      { id: 'opt2', text: 'Aplicación Móvil', votes: 10 }
    ],
    totalVotes: 25,
    priority: 5,
    discussionId: 'disc1'
  },
  {
    id: '3',
    type: 'broadcast',
    title: 'Actualización de Normas de la Comunidad',
    description: 'Hemos actualizado nuestras normas de la comunidad para garantizar una mejor experiencia para todos.',
    previewText: 'Hemos actualizado nuestras normas de la comunidad...',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isUrgent: false,
    backgroundColor: '#FFFBF8',
    priority: 5,
    relatedUsers: [
      { id: 'user4', name: 'Alice Williams', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
      { id: 'user5', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?img=5' }
    ]
  }
];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept when mock data is enabled
  if (!environment.useMockData) {
    return next(req);
  }

  // Login requests
  if (req.url.includes('/api/auth/login') && req.method === 'POST') {
    return handleLogin(req.body as LoginCredentials);
  }

  // Admin profile requests
  if (req.url.includes('/api/admin/profile')) {
    if (req.method === 'GET') return handleGetProfile();
    if (req.method === 'POST') return handleSaveProfile(req.body as ProfileData);
  }

  // Announcements
  if (req.url.includes('/api/announcements') && !req.url.includes('/broadcasts/') && !req.url.includes('/polls/')) {
    return of(new HttpResponse({ status: 200, body: MOCK_ANNOUNCEMENTS }));
  }

  return next(req);
};

function handleLogin(credentials: LoginCredentials) {
  const user = MOCK_USERS.find(u => u.email === credentials.email);

  if (user) {
    return of(new HttpResponse({
      status: 200,
      body: { success: true, token: `mock-token-${user.id}`, user }
    })).pipe(delay(500));
  }

  return of(new HttpResponse({
    status: 401,
    body: { success: false, error: 'Invalid email or password' }
  })).pipe(delay(500));
}

function handleGetProfile() {
  const profileComplete = localStorage.getItem('profileComplete') === 'true';
  const mockProfile = localStorage.getItem('mockAdminProfile');

  if (mockProfile) {
    return of(new HttpResponse({ status: 200, body: JSON.parse(mockProfile) }));
  }

  return of(new HttpResponse({
    status: 200,
    body: {
      id: '1', userId: 'user-1', fullName: '', phoneNumber: '',
      adminId: '', profileComplete, createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }));
}

function handleSaveProfile(profileData: ProfileData) {
  const savedProfile = {
    id: '1', userId: 'user-1',
    fullName: profileData.fullName,
    phoneNumber: profileData.phoneNumber,
    adminId: profileData.adminId,
    profileComplete: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem('mockAdminProfile', JSON.stringify(savedProfile));
  localStorage.setItem('profileComplete', 'true');

  return of(new HttpResponse({
    status: 200,
    body: { success: true, profile: savedProfile }
  }));
}
