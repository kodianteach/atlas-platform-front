/**
 * Mock Comment Data
 * Sample comments referencing mock posts and users
 */

import { Comment } from '../types/entities.interface';

export const MOCK_COMMENTS: Comment[] = [
  // Comments on post-1: Welcome to Atlas Platform (3 comments)
  {
    id: 'comment-1',
    postId: 'post-1',
    authorId: 'user-3',
    content: 'This is great news! Looking forward to using the new platform.',
    parentCommentId: undefined,
    createdAt: '2024-01-20T11:30:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
    isActive: true
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    authorId: 'user-2',
    content: 'Welcome everyone! Please feel free to share your feedback.',
    parentCommentId: undefined,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
    isActive: true
  },
  {
    id: 'comment-3',
    postId: 'post-1',
    authorId: 'user-5',
    content: 'Thanks for the update. The interface looks very user-friendly.',
    parentCommentId: 'comment-1',
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    isActive: true
  },

  // Comments on post-2: Maintenance Schedule (5 comments)
  {
    id: 'comment-4',
    postId: 'post-2',
    authorId: 'user-1',
    content: 'Will the stairs be accessible during the maintenance?',
    parentCommentId: undefined,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    isActive: true
  },
  {
    id: 'comment-5',
    postId: 'post-2',
    authorId: 'user-2',
    content: 'Yes, all stairwells will remain open. Only elevators will be out of service.',
    parentCommentId: 'comment-4',
    createdAt: '2024-03-01T10:30:00Z',
    updatedAt: '2024-03-01T10:30:00Z',
    isActive: true
  },
  {
    id: 'comment-6',
    postId: 'post-2',
    authorId: 'user-7',
    content: 'Good to know. I will plan accordingly.',
    parentCommentId: 'comment-5',
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-01T11:00:00Z',
    isActive: true
  },
  {
    id: 'comment-7',
    postId: 'post-2',
    authorId: 'user-3',
    content: 'Thanks for the advance notice!',
    parentCommentId: undefined,
    createdAt: '2024-03-01T13:45:00Z',
    updatedAt: '2024-03-01T13:45:00Z',
    isActive: true
  },
  {
    id: 'comment-8',
    postId: 'post-2',
    authorId: 'user-4',
    content: 'Will there be any noise during the maintenance?',
    parentCommentId: undefined,
    createdAt: '2024-03-01T15:20:00Z',
    updatedAt: '2024-03-01T15:20:00Z',
    isActive: true
  },

  // Comments on post-3: Community Event Spring BBQ (12 comments)
  {
    id: 'comment-9',
    postId: 'post-3',
    authorId: 'user-1',
    content: 'Count me in! This sounds like a lot of fun.',
    parentCommentId: undefined,
    createdAt: '2024-03-15T15:00:00Z',
    updatedAt: '2024-03-15T15:00:00Z',
    isActive: true
  },
  {
    id: 'comment-10',
    postId: 'post-3',
    authorId: 'user-2',
    content: 'Can we bring guests?',
    parentCommentId: undefined,
    createdAt: '2024-03-15T16:30:00Z',
    updatedAt: '2024-03-15T16:30:00Z',
    isActive: true
  },
  {
    id: 'comment-11',
    postId: 'post-3',
    authorId: 'user-3',
    content: 'Yes! Each resident can bring up to 2 guests.',
    parentCommentId: 'comment-10',
    createdAt: '2024-03-15T17:00:00Z',
    updatedAt: '2024-03-15T17:00:00Z',
    isActive: true
  },
  {
    id: 'comment-12',
    postId: 'post-3',
    authorId: 'user-4',
    content: 'Will there be vegetarian options?',
    parentCommentId: undefined,
    createdAt: '2024-03-16T09:00:00Z',
    updatedAt: '2024-03-16T09:00:00Z',
    isActive: true
  },
  {
    id: 'comment-13',
    postId: 'post-3',
    authorId: 'user-5',
    content: 'Absolutely! We will have plenty of vegetarian and vegan options.',
    parentCommentId: 'comment-12',
    createdAt: '2024-03-16T10:15:00Z',
    updatedAt: '2024-03-16T10:15:00Z',
    isActive: true
  },
  {
    id: 'comment-14',
    postId: 'post-3',
    authorId: 'user-7',
    content: 'Looking forward to it! Great initiative.',
    parentCommentId: undefined,
    createdAt: '2024-03-16T14:30:00Z',
    updatedAt: '2024-03-16T14:30:00Z',
    isActive: true
  },
  {
    id: 'comment-15',
    postId: 'post-3',
    authorId: 'user-1',
    content: 'Should we bring anything?',
    parentCommentId: undefined,
    createdAt: '2024-03-17T08:00:00Z',
    updatedAt: '2024-03-17T08:00:00Z',
    isActive: true
  },
  {
    id: 'comment-16',
    postId: 'post-3',
    authorId: 'user-3',
    content: 'Just bring yourselves and good vibes! Everything else is covered.',
    parentCommentId: 'comment-15',
    createdAt: '2024-03-17T09:30:00Z',
    updatedAt: '2024-03-17T09:30:00Z',
    isActive: true
  },
  {
    id: 'comment-17',
    postId: 'post-3',
    authorId: 'user-2',
    content: 'Can we help with setup?',
    parentCommentId: undefined,
    createdAt: '2024-03-17T11:00:00Z',
    updatedAt: '2024-03-17T11:00:00Z',
    isActive: true
  },
  {
    id: 'comment-18',
    postId: 'post-3',
    authorId: 'user-3',
    content: 'That would be wonderful! We will send out a volunteer signup sheet.',
    parentCommentId: 'comment-17',
    createdAt: '2024-03-17T12:00:00Z',
    updatedAt: '2024-03-17T12:00:00Z',
    isActive: true
  },
  {
    id: 'comment-19',
    postId: 'post-3',
    authorId: 'user-5',
    content: 'This is going to be amazing!',
    parentCommentId: undefined,
    createdAt: '2024-03-17T14:00:00Z',
    updatedAt: '2024-03-17T14:00:00Z',
    isActive: true
  },
  {
    id: 'comment-20',
    postId: 'post-3',
    authorId: 'user-4',
    content: 'What time does it start?',
    parentCommentId: undefined,
    createdAt: '2024-03-18T08:30:00Z',
    updatedAt: '2024-03-18T08:30:00Z',
    isActive: true
  },

  // Comments on post-4: Security Update (7 comments)
  {
    id: 'comment-21',
    postId: 'post-4',
    authorId: 'user-3',
    content: 'Will the old cards still work during the transition?',
    parentCommentId: undefined,
    createdAt: '2024-02-10T12:00:00Z',
    updatedAt: '2024-02-10T12:00:00Z',
    isActive: true
  },
  {
    id: 'comment-22',
    postId: 'post-4',
    authorId: 'user-4',
    content: 'Yes, old cards will work until March 1st. Please activate your new card before then.',
    parentCommentId: 'comment-21',
    createdAt: '2024-02-10T13:00:00Z',
    updatedAt: '2024-02-10T13:00:00Z',
    isActive: true
  },
  {
    id: 'comment-23',
    postId: 'post-4',
    authorId: 'user-1',
    content: 'Great security upgrade! Thank you.',
    parentCommentId: undefined,
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
    isActive: true
  },
  {
    id: 'comment-24',
    postId: 'post-4',
    authorId: 'user-5',
    content: 'How do we activate the new cards?',
    parentCommentId: undefined,
    createdAt: '2024-02-11T09:00:00Z',
    updatedAt: '2024-02-11T09:00:00Z',
    isActive: true
  },
  {
    id: 'comment-25',
    postId: 'post-4',
    authorId: 'user-4',
    content: 'Instructions will be included with your new card. You can also visit the security desk for assistance.',
    parentCommentId: 'comment-24',
    createdAt: '2024-02-11T10:00:00Z',
    updatedAt: '2024-02-11T10:00:00Z',
    isActive: true
  },
  {
    id: 'comment-26',
    postId: 'post-4',
    authorId: 'user-2',
    content: 'Will guests need new cards too?',
    parentCommentId: undefined,
    createdAt: '2024-02-11T15:00:00Z',
    updatedAt: '2024-02-11T15:00:00Z',
    isActive: true
  },
  {
    id: 'comment-27',
    postId: 'post-4',
    authorId: 'user-4',
    content: 'Guest access will be managed through the new mobile app. More details coming soon.',
    parentCommentId: 'comment-26',
    createdAt: '2024-02-11T16:00:00Z',
    updatedAt: '2024-02-11T16:00:00Z',
    isActive: true
  },

  // Comments on post-5: Parking Lot Resurfacing (9 comments)
  {
    id: 'comment-28',
    postId: 'post-5',
    authorId: 'user-1',
    content: 'How long will the resurfacing take?',
    parentCommentId: undefined,
    createdAt: '2024-03-08T09:30:00Z',
    updatedAt: '2024-03-08T09:30:00Z',
    isActive: true
  },
  {
    id: 'comment-29',
    postId: 'post-5',
    authorId: 'user-5',
    content: 'The work should be completed by Friday evening.',
    parentCommentId: 'comment-28',
    createdAt: '2024-03-08T10:00:00Z',
    updatedAt: '2024-03-08T10:00:00Z',
    isActive: true
  },
  {
    id: 'comment-30',
    postId: 'post-5',
    authorId: 'user-3',
    content: 'Where exactly is the temporary parking area?',
    parentCommentId: undefined,
    createdAt: '2024-03-08T11:00:00Z',
    updatedAt: '2024-03-08T11:00:00Z',
    isActive: true
  },
  {
    id: 'comment-31',
    postId: 'post-5',
    authorId: 'user-5',
    content: 'The temporary area is on the north side of the building. Signs will be posted.',
    parentCommentId: 'comment-30',
    createdAt: '2024-03-08T11:30:00Z',
    updatedAt: '2024-03-08T11:30:00Z',
    isActive: true
  },
  {
    id: 'comment-32',
    postId: 'post-5',
    authorId: 'user-2',
    content: 'Will there be enough space for everyone?',
    parentCommentId: undefined,
    createdAt: '2024-03-08T13:00:00Z',
    updatedAt: '2024-03-08T13:00:00Z',
    isActive: true
  },
  {
    id: 'comment-33',
    postId: 'post-5',
    authorId: 'user-5',
    content: 'Yes, we have secured additional overflow parking nearby if needed.',
    parentCommentId: 'comment-32',
    createdAt: '2024-03-08T14:00:00Z',
    updatedAt: '2024-03-08T14:00:00Z',
    isActive: true
  },
  {
    id: 'comment-34',
    postId: 'post-5',
    authorId: 'user-7',
    content: 'Thanks for the heads up!',
    parentCommentId: undefined,
    createdAt: '2024-03-08T15:30:00Z',
    updatedAt: '2024-03-08T15:30:00Z',
    isActive: true
  },
  {
    id: 'comment-35',
    postId: 'post-5',
    authorId: 'user-4',
    content: 'Will the new surface be better for winter weather?',
    parentCommentId: undefined,
    createdAt: '2024-03-09T08:00:00Z',
    updatedAt: '2024-03-09T08:00:00Z',
    isActive: true
  },
  {
    id: 'comment-36',
    postId: 'post-5',
    authorId: 'user-5',
    content: 'Yes! The new surface includes improved drainage and is more resistant to freeze-thaw cycles.',
    parentCommentId: 'comment-35',
    createdAt: '2024-03-09T09:00:00Z',
    updatedAt: '2024-03-09T09:00:00Z',
    isActive: true
  },

  // Comments on post-6: Lost and Found (2 comments)
  {
    id: 'comment-37',
    postId: 'post-6',
    authorId: 'user-2',
    content: 'I lost my umbrella last week. I will check with reception.',
    parentCommentId: undefined,
    createdAt: '2024-03-12T17:00:00Z',
    updatedAt: '2024-03-12T17:00:00Z',
    isActive: true
  },
  {
    id: 'comment-38',
    postId: 'post-6',
    authorId: 'user-3',
    content: 'How long will items be held?',
    parentCommentId: undefined,
    createdAt: '2024-03-13T09:00:00Z',
    updatedAt: '2024-03-13T09:00:00Z',
    isActive: true
  },

  // Comments on post-7: Gym Equipment Upgrade (8 comments)
  {
    id: 'comment-39',
    postId: 'post-7',
    authorId: 'user-3',
    content: 'The new treadmills are amazing! Great upgrade.',
    parentCommentId: undefined,
    createdAt: '2024-02-25T14:00:00Z',
    updatedAt: '2024-02-25T14:00:00Z',
    isActive: true
  },
  {
    id: 'comment-40',
    postId: 'post-7',
    authorId: 'user-1',
    content: 'Are there any new classes being offered?',
    parentCommentId: undefined,
    createdAt: '2024-02-25T15:30:00Z',
    updatedAt: '2024-02-25T15:30:00Z',
    isActive: true
  },
  {
    id: 'comment-41',
    postId: 'post-7',
    authorId: 'user-7',
    content: 'Yes! We are adding yoga and spin classes starting next month.',
    parentCommentId: 'comment-40',
    createdAt: '2024-02-25T16:00:00Z',
    updatedAt: '2024-02-25T16:00:00Z',
    isActive: true
  },
  {
    id: 'comment-42',
    postId: 'post-7',
    authorId: 'user-2',
    content: 'Will there be a fee for the classes?',
    parentCommentId: 'comment-41',
    createdAt: '2024-02-26T09:00:00Z',
    updatedAt: '2024-02-26T09:00:00Z',
    isActive: true
  },
  {
    id: 'comment-43',
    postId: 'post-7',
    authorId: 'user-7',
    content: 'Classes are included with your membership at no additional cost.',
    parentCommentId: 'comment-42',
    createdAt: '2024-02-26T10:00:00Z',
    updatedAt: '2024-02-26T10:00:00Z',
    isActive: true
  },
  {
    id: 'comment-44',
    postId: 'post-7',
    authorId: 'user-5',
    content: 'Excellent news! Looking forward to trying them out.',
    parentCommentId: undefined,
    createdAt: '2024-02-26T14:00:00Z',
    updatedAt: '2024-02-26T14:00:00Z',
    isActive: true
  },
  {
    id: 'comment-45',
    postId: 'post-7',
    authorId: 'user-4',
    content: 'What are the gym hours?',
    parentCommentId: undefined,
    createdAt: '2024-02-27T08:00:00Z',
    updatedAt: '2024-02-27T08:00:00Z',
    isActive: true
  },
  {
    id: 'comment-46',
    postId: 'post-7',
    authorId: 'user-7',
    content: 'The gym is open 24/7 for residents with access cards.',
    parentCommentId: 'comment-45',
    createdAt: '2024-02-27T09:00:00Z',
    updatedAt: '2024-02-27T09:00:00Z',
    isActive: true
  }
];
