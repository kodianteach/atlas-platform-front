import * as fc from 'fast-check';
import { AuthorizationRecord, AuthorizationFormValue } from '../models/authorization.model';

/**
 * Property-based testing generators for authorization feature
 * These generators create random valid test data for property tests
 */

/**
 * Generates a random valid first name (2-50 characters, letters only)
 */
export const firstNameArbitrary = (): fc.Arbitrary<string> =>
  fc.stringMatching(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/);

/**
 * Generates a random valid last name (2-50 characters, letters only)
 */
export const lastNameArbitrary = (): fc.Arbitrary<string> =>
  fc.stringMatching(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/);

/**
 * Generates a random valid ID document (5-20 characters, alphanumeric)
 */
export const idDocumentArbitrary = (): fc.Arbitrary<string> =>
  fc.stringMatching(/^[a-zA-Z0-9]{5,20}$/);

/**
 * Generates a random entry type (visitor or courier)
 */
export const entryTypeArbitrary = (): fc.Arbitrary<'visitor' | 'courier'> =>
  fc.constantFrom('visitor' as const, 'courier' as const);

/**
 * Generates a random valid license plate (6-10 characters, alphanumeric with hyphens)
 */
export const licensePlateArbitrary = (): fc.Arbitrary<string> =>
  fc.stringMatching(/^[A-Z0-9]{3}-?[A-Z0-9]{3,4}$/);

/**
 * Generates a random validity period from predefined options
 * Options: 1 hour (60), 2 hours (120), 4 hours (240), 8 hours (480), 24 hours (1440)
 */
export const validityPeriodArbitrary = (): fc.Arbitrary<number> =>
  fc.constantFrom(60, 120, 240, 480, 1440);

/**
 * Generates a random order origin (2-100 characters)
 */
export const orderOriginArbitrary = (): fc.Arbitrary<string> =>
  fc.string({ minLength: 2, maxLength: 100 });

/**
 * Generates a random order type (2-50 characters)
 */
export const orderTypeArbitrary = (): fc.Arbitrary<string> =>
  fc.string({ minLength: 2, maxLength: 50 });

/**
 * Generates a random UUID v4 string
 */
export const uuidArbitrary = (): fc.Arbitrary<string> =>
  fc.uuid();

/**
 * Generates a random date within a reasonable range (past year to next year)
 */
export const dateArbitrary = (): fc.Arbitrary<Date> =>
  fc.date({ min: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) });

/**
 * Generates a valid AuthorizationFormValue with all required fields
 * Conditionally includes optional fields based on entryType and hasVehicle
 */
export const authorizationFormValueArbitrary = (): fc.Arbitrary<AuthorizationFormValue> =>
  fc.record({
    firstName: firstNameArbitrary(),
    lastName: lastNameArbitrary(),
    idDocument: idDocumentArbitrary(),
    entryType: entryTypeArbitrary(),
    hasVehicle: fc.boolean(),
    validityPeriod: validityPeriodArbitrary(),
  }).chain((base) => {
    // Add license plate if hasVehicle is true
    if (base.hasVehicle) {
      return licensePlateArbitrary().chain((licensePlate) => {
        // Add courier fields if entryType is 'courier'
        if (base.entryType === 'courier') {
          return fc.tuple(orderOriginArbitrary(), orderTypeArbitrary()).map(([orderOrigin, orderType]) => ({
            ...base,
            licensePlate,
            orderOrigin,
            orderType,
          }));
        }
        return fc.constant({ ...base, licensePlate });
      });
    } else {
      // No vehicle, check if courier
      if (base.entryType === 'courier') {
        return fc.tuple(orderOriginArbitrary(), orderTypeArbitrary()).map(([orderOrigin, orderType]) => ({
          ...base,
          orderOrigin,
          orderType,
        }));
      }
      return fc.constant(base);
    }
  });

/**
 * Generates a valid AuthorizationRecord with all required fields
 * Includes calculated timestamps and conditionally includes optional fields
 */
export const authorizationRecordArbitrary = (): fc.Arbitrary<AuthorizationRecord> =>
  fc.record({
    id: uuidArbitrary(),
    firstName: firstNameArbitrary(),
    lastName: lastNameArbitrary(),
    idDocument: idDocumentArbitrary(),
    entryType: entryTypeArbitrary(),
    hasVehicle: fc.boolean(),
    validityPeriod: validityPeriodArbitrary(),
    createdAt: dateArbitrary(),
  }).chain((base) => {
    // Calculate expiresAt based on createdAt and validityPeriod
    const expiresAt = new Date(base.createdAt.getTime() + base.validityPeriod * 60 * 1000);

    // Add license plate if hasVehicle is true
    if (base.hasVehicle) {
      return licensePlateArbitrary().chain((licensePlate) => {
        // Add courier fields if entryType is 'courier'
        if (base.entryType === 'courier') {
          return fc.tuple(orderOriginArbitrary(), orderTypeArbitrary()).map(([orderOrigin, orderType]) => ({
            ...base,
            expiresAt,
            licensePlate,
            orderOrigin,
            orderType,
          }));
        }
        return fc.constant({ ...base, expiresAt, licensePlate });
      });
    } else {
      // No vehicle, check if courier
      if (base.entryType === 'courier') {
        return fc.tuple(orderOriginArbitrary(), orderTypeArbitrary()).map(([orderOrigin, orderType]) => ({
          ...base,
          expiresAt,
          orderOrigin,
          orderType,
        }));
      }
      return fc.constant({ ...base, expiresAt });
    }
  });

/**
 * Generates an AuthorizationFormValue with at least one empty mandatory field
 * Useful for testing validation behavior
 */
export const invalidFormValueArbitrary = (): fc.Arbitrary<Partial<AuthorizationFormValue>> =>
  authorizationFormValueArbitrary().chain((validForm) => {
    const mandatoryFields: (keyof AuthorizationFormValue)[] = [
      'firstName',
      'lastName',
      'idDocument',
    ];

    return fc.constantFrom(...mandatoryFields).map((fieldToEmpty) => {
      const invalidForm = { ...validForm };
      (invalidForm as any)[fieldToEmpty] = '';
      return invalidForm;
    });
  });

/**
 * Generates an array of AuthorizationRecords with random length
 * Useful for testing list operations and sorting
 */
export const authorizationRecordArrayArbitrary = (
  minLength: number = 0,
  maxLength: number = 20
): fc.Arbitrary<AuthorizationRecord[]> =>
  fc.array(authorizationRecordArbitrary(), { minLength, maxLength });

/**
 * Helper function to run a property test with standard configuration
 * Ensures minimum 100 iterations as specified in design document
 */
export const runPropertyTest = <T>(
  arbitrary: fc.Arbitrary<T>,
  predicate: (value: T) => boolean | void,
  options?: fc.Parameters<[T]>
): void => {
  fc.assert(
    fc.property(arbitrary, predicate),
    { numRuns: 100, ...options }
  );
};

/**
 * Helper function to create a property test with multiple arbitraries
 */
export const runPropertyTestMultiple = <T1, T2>(
  arb1: fc.Arbitrary<T1>,
  arb2: fc.Arbitrary<T2>,
  predicate: (v1: T1, v2: T2) => boolean | void,
  options?: fc.Parameters<[T1, T2]>
): void => {
  fc.assert(
    fc.property(arb1, arb2, predicate),
    { numRuns: 100, ...options }
  );
};

/**
 * Property-based testing generators for announcements feature
 * These generators create random valid test data for property tests
 */

import { 
  Announcement, 
  BroadcastMessage, 
  Poll, 
  PollOption, 
  AnnouncementUser,
  PostResponse,
  PollResponse,
  PollOptionResponse,
  CommentResponse,
  Comment
} from '@domain/models/announcement/announcement.model';
import { Discussion, DiscussionMessage } from '@domain/models/announcement/discussion.model';
import { BackendNotification } from '@domain/models/notification/notification.model';

/**
 * Generates a random User (AnnouncementUser)
 */
export const userArbitrary = (): fc.Arbitrary<AnnouncementUser> => {
  return fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 50 }),
    avatarUrl: fc.webUrl()
  });
};

/**
 * Generates a random PollOption (frontend model with number id)
 */
export const pollOptionArbitrary = (): fc.Arbitrary<PollOption> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    text: fc.string({ minLength: 1, maxLength: 100 }),
    votes: fc.nat({ max: 10000 }),
    percentage: fc.double({ min: 0, max: 100, noNaN: true })
  });
};

/**
 * Generates a random BroadcastMessage (frontend model with number id)
 */
export const broadcastMessageArbitrary = (): fc.Arbitrary<BroadcastMessage> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    type: fc.constant('broadcast' as const),
    createdAt: fc.date().map(d => d.toISOString()),
    priority: fc.integer({ min: 0, max: 10 }),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ minLength: 10, maxLength: 500 }),
    previewText: fc.string({ minLength: 10, maxLength: 150 }),
    postType: fc.constantFrom('ANNOUNCEMENT' as const, 'NEWS' as const, 'AD' as const),
    isPinned: fc.boolean(),
    allowComments: fc.boolean(),
    status: fc.constantFrom('DRAFT' as const, 'PUBLISHED' as const, 'ARCHIVED' as const),
    authorId: fc.nat({ max: 10000 }),
    organizationId: fc.nat({ max: 1000 }),
    publishedAt: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
    isUrgent: fc.boolean(),
    backgroundColor: fc.stringMatching(/^#[0-9A-F]{6}$/),
    relatedUsers: fc.array(userArbitrary(), { minLength: 0, maxLength: 20 })
  });
};

/**
 * Generates a random Poll with consistent totalVotes
 * Ensures totalVotes equals the sum of all option votes
 */
export const pollArbitrary = (): fc.Arbitrary<Poll> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    type: fc.constant('poll' as const),
    createdAt: fc.date().map(d => d.toISOString()),
    priority: fc.integer({ min: 0, max: 10 }),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    question: fc.string({ minLength: 10, maxLength: 200 }),
    icon: fc.string({ minLength: 1, maxLength: 50 }),
    status: fc.constantFrom('DRAFT' as const, 'ACTIVE' as const, 'CLOSED' as const),
    endsAt: fc.option(fc.date({ min: new Date() }).map(d => d.toISOString()), { nil: null }),
    options: fc.array(pollOptionArbitrary(), { minLength: 2, maxLength: 6 }),
    userVote: fc.option(fc.nat({ max: 100000 }), { nil: undefined }),
    allowMultiple: fc.boolean(),
    isAnonymous: fc.boolean(),
    organizationId: fc.nat({ max: 1000 }),
    authorId: fc.nat({ max: 10000 }),
    discussionId: fc.uuid()
  }).map(poll => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    return { ...poll, totalVotes };
  });
};

/**
 * Generates a random Announcement (union of BroadcastMessage and Poll)
 */
export const announcementArbitrary = (): fc.Arbitrary<Announcement> => {
  return fc.oneof(broadcastMessageArbitrary(), pollArbitrary());
};

/**
 * Generates an array of Announcements with random length
 * Useful for testing list operations and sorting
 */
export const announcementArrayArbitrary = (
  minLength: number = 0,
  maxLength: number = 50
): fc.Arbitrary<Announcement[]> => {
  return fc.array(announcementArbitrary(), { minLength, maxLength });
};

/**
 * Generates a random DiscussionMessage
 */
export const discussionMessageArbitrary = (): fc.Arbitrary<DiscussionMessage> => {
  return fc.record({
    id: fc.uuid(),
    userId: fc.uuid(),
    userName: fc.string({ minLength: 1, maxLength: 50 }),
    text: fc.string({ minLength: 1, maxLength: 500 }),
    createdAt: fc.date()
  });
};

/**
 * Generates a random Discussion
 */
export const discussionArbitrary = (): fc.Arbitrary<Discussion> => {
  return fc.record({
    id: fc.uuid(),
    pollId: fc.uuid(),
    messages: fc.array(discussionMessageArbitrary(), { minLength: 0, maxLength: 50 })
  });
};

/**
 * Generates a Poll with a specific number of options
 * Useful for testing specific scenarios
 */
export const pollWithOptionsArbitrary = (
  minOptions: number,
  maxOptions: number
): fc.Arbitrary<Poll> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    type: fc.constant('poll' as const),
    createdAt: fc.date().map(d => d.toISOString()),
    priority: fc.integer({ min: 0, max: 10 }),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    question: fc.string({ minLength: 10, maxLength: 200 }),
    icon: fc.string({ minLength: 1, maxLength: 50 }),
    status: fc.constantFrom('DRAFT' as const, 'ACTIVE' as const, 'CLOSED' as const),
    endsAt: fc.option(fc.date({ min: new Date() }).map(d => d.toISOString()), { nil: null }),
    options: fc.array(pollOptionArbitrary(), { minLength: minOptions, maxLength: maxOptions }),
    userVote: fc.option(fc.nat({ max: 100000 }), { nil: undefined }),
    allowMultiple: fc.boolean(),
    isAnonymous: fc.boolean(),
    organizationId: fc.nat({ max: 1000 }),
    authorId: fc.nat({ max: 10000 }),
    discussionId: fc.uuid()
  }).map(poll => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    return { ...poll, totalVotes };
  });
};

/**
 * Generates a BroadcastMessage with a specific number of related users
 * Useful for testing avatar group display logic
 */
export const broadcastWithUsersArbitrary = (
  minUsers: number,
  maxUsers: number
): fc.Arbitrary<BroadcastMessage> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    type: fc.constant('broadcast' as const),
    createdAt: fc.date().map(d => d.toISOString()),
    priority: fc.integer({ min: 0, max: 10 }),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ minLength: 10, maxLength: 500 }),
    previewText: fc.string({ minLength: 10, maxLength: 150 }),
    postType: fc.constantFrom('ANNOUNCEMENT' as const, 'NEWS' as const, 'AD' as const),
    isPinned: fc.boolean(),
    allowComments: fc.boolean(),
    status: fc.constantFrom('DRAFT' as const, 'PUBLISHED' as const, 'ARCHIVED' as const),
    authorId: fc.nat({ max: 10000 }),
    organizationId: fc.nat({ max: 1000 }),
    publishedAt: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
    isUrgent: fc.boolean(),
    backgroundColor: fc.stringMatching(/^#[0-9A-F]{6}$/),
    relatedUsers: fc.array(userArbitrary(), { minLength: minUsers, maxLength: maxUsers })
  });
};

/**
 * Generates a Poll that ends within a specific time range
 * Useful for testing time-based prioritization
 */
export const pollEndingInArbitrary = (
  minHours: number,
  maxHours: number
): fc.Arbitrary<Poll> => {
  const now = new Date();
  const minTime = new Date(now.getTime() + minHours * 60 * 60 * 1000);
  const maxTime = new Date(now.getTime() + maxHours * 60 * 60 * 1000);
  
  return fc.record({
    id: fc.nat({ max: 100000 }),
    type: fc.constant('poll' as const),
    createdAt: fc.date().map(d => d.toISOString()),
    priority: fc.integer({ min: 0, max: 10 }),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    question: fc.string({ minLength: 10, maxLength: 200 }),
    icon: fc.string({ minLength: 1, maxLength: 50 }),
    status: fc.constant('ACTIVE' as const),
    endsAt: fc.date({ min: minTime, max: maxTime }).map(d => d.toISOString()),
    options: fc.array(pollOptionArbitrary(), { minLength: 2, maxLength: 6 }),
    userVote: fc.option(fc.nat({ max: 100000 }), { nil: undefined }),
    allowMultiple: fc.boolean(),
    isAnonymous: fc.boolean(),
    organizationId: fc.nat({ max: 1000 }),
    authorId: fc.nat({ max: 10000 }),
    discussionId: fc.uuid()
  }).map(poll => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    return { ...poll, totalVotes };
  });
};

/**
 * Generates an array of Users with random length
 * Useful for testing avatar group display
 */
export const userArrayArbitrary = (
  minLength: number = 0,
  maxLength: number = 20
): fc.Arbitrary<AnnouncementUser[]> => {
  return fc.array(userArbitrary(), { minLength, maxLength });
};

/**
 * Property-based testing generators for Access Permissions Management feature
 * These generators create random valid test data for authorization property tests
 */

/**
 * Generates a random valid authorization name (2-50 characters)
 */
export const authorizationNameArbitrary = (): fc.Arbitrary<string> =>
  fc.string({ minLength: 2, maxLength: 50 });

/**
 * Generates a random authorization icon identifier
 */
export const authorizationIconArbitrary = (): fc.Arbitrary<string> =>
  fc.constantFrom('person', 'family', 'work', 'delivery', 'service', 'guest');

/**
 * Generates a random day of the week abbreviation
 */
export const dayOfWeekArbitrary = (): fc.Arbitrary<string> =>
  fc.constantFrom('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');

/**
 * Generates a random time in 12-hour format (e.g., "09:00 AM")
 */
export const timeArbitrary = (): fc.Arbitrary<string> =>
  fc.tuple(
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 0, max: 59 }),
    fc.constantFrom('AM', 'PM')
  ).map(([hour, minute, period]) => {
    const hourStr = hour.toString().padStart(2, '0');
    const minuteStr = minute.toString().padStart(2, '0');
    return `${hourStr}:${minuteStr} ${period}`;
  });

/**
 * Generates a random time range (e.g., "09:00 AM - 02:00 PM")
 */
export const timeRangeArbitrary = (): fc.Arbitrary<string> =>
  fc.tuple(timeArbitrary(), timeArbitrary()).map(([start, end]) => `${start} - ${end}`);

/**
 * Generates a random ScheduleDetails object
 * Includes 1-7 days and a time range
 */
export const scheduleDetailsArbitrary = (): fc.Arbitrary<import('../models/authorization.model').ScheduleDetails> =>
  fc.record({
    days: fc.array(dayOfWeekArbitrary(), { minLength: 1, maxLength: 7 }).map(days => [...new Set(days)]),
    timeRange: timeRangeArbitrary()
  });

/**
 * Generates AuthorizationDetails for permanent access type
 */
export const permanentAuthorizationDetailsArbitrary = (): fc.Arbitrary<import('../models/authorization.model').AuthorizationDetails> =>
  fc.constant({
    accessType: 'Permanent Access',
    permissions: 'Full Permissions'
  });

/**
 * Generates AuthorizationDetails for scheduled access type
 */
export const scheduledAuthorizationDetailsArbitrary = (): fc.Arbitrary<import('../models/authorization.model').AuthorizationDetails> =>
  scheduleDetailsArbitrary().map(schedule => ({
    schedule
  }));

/**
 * Generates a random Authorization with permanent access type
 */
export const permanentAuthorizationArbitrary = (): fc.Arbitrary<import('../models/authorization.model').Authorization> =>
  fc.record({
    id: fc.uuid(),
    name: authorizationNameArbitrary(),
    type: fc.constant('permanent' as const),
    isActive: fc.boolean(),
    icon: authorizationIconArbitrary(),
    details: permanentAuthorizationDetailsArbitrary(),
    createdAt: dateArbitrary(),
    updatedAt: dateArbitrary()
  });

/**
 * Generates a random Authorization with scheduled access type
 */
export const scheduledAuthorizationArbitrary = (): fc.Arbitrary<import('../models/authorization.model').Authorization> =>
  fc.record({
    id: fc.uuid(),
    name: authorizationNameArbitrary(),
    type: fc.constant('scheduled' as const),
    isActive: fc.boolean(),
    icon: authorizationIconArbitrary(),
    details: scheduledAuthorizationDetailsArbitrary(),
    createdAt: dateArbitrary(),
    updatedAt: dateArbitrary()
  });

/**
 * Generates a random Authorization (either permanent or scheduled)
 * This is the main generator for Authorization objects
 */
export const generateAuthorization = (): fc.Arbitrary<import('../models/authorization.model').Authorization> =>
  fc.oneof(permanentAuthorizationArbitrary(), scheduledAuthorizationArbitrary());

/**
 * Generates an array of random Authorizations
 * Useful for testing list operations and state management
 */
export const generateAuthorizationList = (
  minLength: number = 0,
  maxLength: number = 20
): fc.Arbitrary<import('../models/authorization.model').Authorization[]> =>
  fc.array(generateAuthorization(), { minLength, maxLength });

/**
 * Generates a random ScheduleDetails object
 * Alias for scheduleDetailsArbitrary for consistency with task requirements
 */
export const generateSchedule = (): fc.Arbitrary<import('../models/authorization.model').ScheduleDetails> =>
  scheduleDetailsArbitrary();

/**
 * Generates an Authorization with specific active state
 * Useful for testing toggle functionality
 */
export const authorizationWithActiveStateArbitrary = (
  isActive: boolean
): fc.Arbitrary<import('../models/authorization.model').Authorization> =>
  generateAuthorization().map(auth => ({ ...auth, isActive }));

/**
 * Generates an array of Authorizations with mixed active/inactive states
 * Useful for testing active count calculations
 */
export const mixedActiveAuthorizationListArbitrary = (
  minLength: number = 2,
  maxLength: number = 20
): fc.Arbitrary<import('../models/authorization.model').Authorization[]> =>
  fc.array(generateAuthorization(), { minLength, maxLength }).map(list => {
    // Ensure at least one active and one inactive if list has 2+ items
    if (list.length >= 2) {
      list[0] = { ...list[0], isActive: true };
      list[1] = { ...list[1], isActive: false };
    }
    return list;
  });

/**
 * Generates an Authorization with a specific type
 * Useful for testing type-specific display logic
 */
export const authorizationWithTypeArbitrary = (
  type: 'permanent' | 'scheduled'
): fc.Arbitrary<import('../models/authorization.model').Authorization> =>
  type === 'permanent' ? permanentAuthorizationArbitrary() : scheduledAuthorizationArbitrary();

// =======================================
// HU-11: Canal de Difusión generators
// =======================================

/**
 * Generates a random PostResponse (backend DTO)
 */
export const postResponseArbitrary = (): fc.Arbitrary<PostResponse> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    organizationId: fc.nat({ max: 1000 }),
    authorId: fc.nat({ max: 10000 }),
    title: fc.string({ minLength: 1, maxLength: 150 }),
    content: fc.string({ minLength: 1, maxLength: 5000 }),
    type: fc.constantFrom('ANNOUNCEMENT' as const, 'NEWS' as const, 'AD' as const),
    allowComments: fc.boolean(),
    isPinned: fc.boolean(),
    status: fc.constantFrom('DRAFT' as const, 'PUBLISHED' as const, 'ARCHIVED' as const),
    publishedAt: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
    createdAt: fc.date().map(d => d.toISOString()),
  });
};

/**
 * Generates a random PollOptionResponse (backend DTO)
 */
export const pollOptionResponseArbitrary = (): fc.Arbitrary<PollOptionResponse> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    optionText: fc.string({ minLength: 1, maxLength: 100 }),
    sortOrder: fc.nat({ max: 10 }),
    voteCount: fc.nat({ max: 10000 }),
    percentage: fc.double({ min: 0, max: 100, noNaN: true })
  });
};

/**
 * Generates a random PollResponse (backend DTO)
 */
export const pollResponseArbitrary = (): fc.Arbitrary<PollResponse> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    organizationId: fc.nat({ max: 1000 }),
    authorId: fc.nat({ max: 10000 }),
    title: fc.string({ minLength: 1, maxLength: 150 }),
    description: fc.string({ minLength: 0, maxLength: 500 }),
    allowMultiple: fc.boolean(),
    isAnonymous: fc.boolean(),
    status: fc.constantFrom('DRAFT' as const, 'ACTIVE' as const, 'CLOSED' as const),
    startsAt: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
    endsAt: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
    createdAt: fc.date().map(d => d.toISOString()),
    options: fc.array(pollOptionResponseArbitrary(), { minLength: 2, maxLength: 6 }),
    totalVotes: fc.nat({ max: 50000 })
  });
};

/**
 * Generates a random CommentResponse (backend DTO)
 */
export const commentResponseArbitrary = (): fc.Arbitrary<CommentResponse> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    postId: fc.nat({ max: 100000 }),
    authorId: fc.nat({ max: 10000 }),
    parentId: fc.option(fc.nat({ max: 100000 }), { nil: null }),
    content: fc.string({ minLength: 1, maxLength: 1000 }),
    isApproved: fc.boolean(),
    createdAt: fc.date().map(d => d.toISOString())
  });
};

/**
 * Generates a random Comment (frontend model with replies)
 */
export const commentArbitrary = (): fc.Arbitrary<Comment> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    postId: fc.nat({ max: 100000 }),
    authorId: fc.nat({ max: 10000 }),
    authorName: fc.option(fc.string({ minLength: 2, maxLength: 50 }), { nil: undefined }),
    parentId: fc.option(fc.nat({ max: 100000 }), { nil: null }),
    content: fc.string({ minLength: 1, maxLength: 1000 }),
    isApproved: fc.boolean(),
    createdAt: fc.date().map(d => d.toISOString()),
    replies: fc.constant(undefined as Comment[] | undefined)
  });
};

/**
 * Generates a random BackendNotification (backend DTO)
 */
export const backendNotificationArbitrary = (): fc.Arbitrary<BackendNotification> => {
  return fc.record({
    id: fc.nat({ max: 100000 }),
    organizationId: fc.nat({ max: 1000 }),
    userId: fc.option(fc.nat({ max: 10000 }), { nil: null }),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    message: fc.string({ minLength: 1, maxLength: 500 }),
    type: fc.constantFrom('POST_PUBLISHED' as const, 'POLL_ACTIVATED' as const),
    isRead: fc.boolean(),
    entityType: fc.option(fc.constantFrom('POST', 'POLL'), { nil: null }),
    entityId: fc.option(fc.nat({ max: 100000 }), { nil: null }),
    createdAt: fc.date().map(d => d.toISOString()),
  });
};
