/**
 * Discussion models for poll-related discussions
 */

/**
 * Discussion message
 */
export interface DiscussionMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

/**
 * Discussion thread associated with a poll
 */
export interface Discussion {
  id: string;
  pollId: string;
  messages: DiscussionMessage[];
}
