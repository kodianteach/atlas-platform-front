/**
 * Entity Interfaces for API Mock Services
 * Defines all entity types and enums used across the mock services
 */

// ============================================================================
// Enums
// ============================================================================

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export enum VisitStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum UnitStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED'
}

// ============================================================================
// Base Entity
// ============================================================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// ============================================================================
// Entity Interfaces
// ============================================================================

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId?: string;
}

export interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
  author?: User;
  organizationId: string;
  commentCount: number;
  likeCount: number;
}

export interface Comment extends BaseEntity {
  postId: string;
  authorId: string;
  author?: User;
  content: string;
  parentCommentId?: string;
}

export interface Company extends BaseEntity {
  name: string;
  taxId: string;
  address: string;
  status: Status;
  contactEmail: string;
  contactPhone: string;
}

export interface Organization extends BaseEntity {
  name: string;
  description: string;
  parentOrganizationId?: string;
  companyId: string;
}

export interface Tower extends BaseEntity {
  name: string;
  organizationId: string;
  address: string;
  latitude: number;
  longitude: number;
  status: Status;
  unitCount: number;
}

export interface Unit extends BaseEntity {
  number: string;
  towerId: string;
  floor: number;
  status: UnitStatus;
  area: number;
  occupantId?: string;
}

export interface Visit extends BaseEntity {
  visitorName: string;
  visitorDocument: string;
  unitId: string;
  requestedBy: string;
  scheduledDate: string;
  status: VisitStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Zone extends BaseEntity {
  name: string;
  organizationId: string;
  type: string;
  description: string;
  boundaries?: string; // GeoJSON or coordinate string
}

export interface Poll extends BaseEntity {
  question: string;
  organizationId: string;
  createdBy: string;
  expiresAt: string;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface Invitation extends BaseEntity {
  email: string;
  organizationId: string;
  invitedBy: string;
  code: string;
  status: InvitationStatus;
  expiresAt: string;
}

export interface AccessCode extends BaseEntity {
  code: string;
  userId: string;
  organizationId: string;
  validFrom: string;
  validUntil: string;
  usageCount: number;
  maxUsages: number;
}
