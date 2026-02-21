/**
 * Poll Mock Service
 * 
 * Provides mock implementations for POLL module endpoints including
 * poll and voting operations with vote count management.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { Poll } from './types/entities.interface';
import { CreatePollRequest, VoteRequest } from './types/requests.interface';
import { PollResultsResponse } from './types/responses.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_POLLS } from './data/mock-polls.data';

@Injectable({ providedIn: 'root' })
export class PollMockService {

  createPoll(request: CreatePollRequest, headers?: { 'X-User-Id'?: string }): Observable<ApiResponse<Poll | null>> {
    if (!request.question || !request.organizationId || !request.expiresAt || !request.options || request.options.length === 0) {
      return of(buildErrorResponse('/api/polls', 400, 'Missing required fields: question, organizationId, expiresAt, and options (at least one) are required'));
    }

    const createdBy = headers?.['X-User-Id'] || 'user-1';
    const now = generateTimestamp();
    const newPoll: Poll = {
      id: generateId(),
      question: request.question,
      organizationId: request.organizationId,
      createdBy: createdBy,
      expiresAt: request.expiresAt,
      options: request.options.map((text, index) => ({
        id: `opt-${generateId()}-${index}`,
        text: text,
        voteCount: 0
      })),
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    return of(buildApiResponse(newPoll, '/api/polls', 201, 'Poll created successfully'));
  }

  getPoll(id: string): Observable<ApiResponse<Poll | null>> {
    const poll = MOCK_POLLS.find(p => p.id === id && p.isActive);
    if (!poll) {
      return of(buildErrorResponse(`/api/polls/${id}`, 404, `Poll with id ${id} not found`));
    }
    return of(buildApiResponse(poll, `/api/polls/${id}`, 200, 'Poll retrieved successfully'));
  }

  listPolls(params?: { filter?: { organizationId?: string } }): Observable<ApiResponse<Poll[]>> {
    let polls = MOCK_POLLS.filter(p => p.isActive);

    if (params?.filter?.organizationId) {
      polls = polls.filter(p => p.organizationId === params.filter!.organizationId);
    }

    return of(buildApiResponse(polls, '/api/polls', 200, 'Polls retrieved successfully'));
  }

  vote(request: VoteRequest, headers?: { 'X-User-Id'?: string }): Observable<ApiResponse<Poll | null>> {
    const poll = MOCK_POLLS.find(p => p.id === request.pollId && p.isActive);
    if (!poll) {
      return of(buildErrorResponse('/api/polls/vote', 404, `Poll with id ${request.pollId} not found`));
    }

    const option = poll.options.find(o => o.id === request.optionId);
    if (!option) {
      return of(buildErrorResponse('/api/polls/vote', 404, `Option with id ${request.optionId} not found in poll`));
    }

    // Create updated poll with incremented vote count
    const updatedPoll: Poll = {
      ...poll,
      options: poll.options.map(o => 
        o.id === request.optionId 
          ? { ...o, voteCount: o.voteCount + 1 }
          : o
      ),
      updatedAt: generateTimestamp()
    };

    return of(buildApiResponse(updatedPoll, '/api/polls/vote', 200, 'Vote recorded successfully'));
  }

  getPollResults(id: string, headers?: { 'X-User-Id'?: string }): Observable<ApiResponse<PollResultsResponse | null>> {
    const poll = MOCK_POLLS.find(p => p.id === id && p.isActive);
    if (!poll) {
      return of(buildErrorResponse(`/api/polls/${id}/results`, 404, `Poll with id ${id} not found`));
    }

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
    const results: PollResultsResponse = {
      poll: poll,
      totalVotes: totalVotes,
      userVoted: false,
      userVotedOptionId: undefined
    };

    return of(buildApiResponse(results, `/api/polls/${id}/results`, 200, 'Poll results retrieved successfully'));
  }
}
