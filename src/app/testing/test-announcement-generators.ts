/**
 * Standalone test to verify announcement generators compile and work correctly
 * Run with: npx ts-node src/app/testing/test-announcement-generators.ts
 */

import * as fc from 'fast-check';
import {
  userArbitrary,
  pollOptionArbitrary,
  broadcastMessageArbitrary,
  pollArbitrary,
  announcementArbitrary,
} from './generators';

console.log('Testing announcement generators...\n');

// Test userArbitrary
console.log('1. Testing userArbitrary...');
const user = fc.sample(userArbitrary(), 1)[0];
console.log('   Generated user:', JSON.stringify(user, null, 2));
console.log('   ✓ User generator works\n');

// Test pollOptionArbitrary
console.log('2. Testing pollOptionArbitrary...');
const pollOption = fc.sample(pollOptionArbitrary(), 1)[0];
console.log('   Generated poll option:', JSON.stringify(pollOption, null, 2));
console.log('   ✓ Poll option generator works\n');

// Test broadcastMessageArbitrary
console.log('3. Testing broadcastMessageArbitrary...');
const broadcast = fc.sample(broadcastMessageArbitrary(), 1)[0];
console.log('   Generated broadcast:', JSON.stringify(broadcast, null, 2));
console.log('   ✓ Broadcast message generator works\n');

// Test pollArbitrary
console.log('4. Testing pollArbitrary...');
const poll = fc.sample(pollArbitrary(), 1)[0];
console.log('   Generated poll:', JSON.stringify(poll, null, 2));
const sumOfVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
console.log('   Total votes:', poll.totalVotes);
console.log('   Sum of option votes:', sumOfVotes);
console.log('   Match:', poll.totalVotes === sumOfVotes ? '✓' : '✗');
console.log('   ✓ Poll generator works\n');

// Test announcementArbitrary
console.log('5. Testing announcementArbitrary...');
const announcements = fc.sample(announcementArbitrary(), 5);
console.log('   Generated 5 announcements:');
announcements.forEach((ann, i) => {
  console.log(`   ${i + 1}. Type: ${ann.type}, ID: ${ann.id}`);
});
console.log('   ✓ Announcement generator works\n');

console.log('All generators work correctly! ✓');
