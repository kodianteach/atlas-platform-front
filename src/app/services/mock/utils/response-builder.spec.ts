/**
 * Unit Tests for Response Builder Utility
 */

import { buildApiResponse, buildErrorResponse } from './response-builder';
import { ApiResponse } from '../types/api-response.interface';

describe('Response Builder Utility', () => {
  
  describe('buildApiResponse', () => {
    
    it('should create a successful response with all required fields', () => {
      const testData = { id: '1', name: 'Test' };
      const path = '/api/test';
      
      const response = buildApiResponse(testData, path);
      
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.message).toBe('Success');
      expect(response.data).toEqual(testData);
      expect(response.path).toBe(path);
      expect(response.timestamp).toBeDefined();
    });
    
    it('should use custom status code when provided', () => {
      const testData = { id: '1' };
      const response = buildApiResponse(testData, '/api/test', 201);
      
      expect(response.status).toBe(201);
      expect(response.success).toBe(true);
    });
    
    it('should use custom message when provided', () => {
      const testData = { id: '1' };
      const customMessage = 'Resource created successfully';
      const response = buildApiResponse(testData, '/api/test', 201, customMessage);
      
      expect(response.message).toBe(customMessage);
    });
    
    it('should generate valid ISO 8601 timestamp', () => {
      const testData = { id: '1' };
      const response = buildApiResponse(testData, '/api/test');
      
      // ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
    
    it('should generate timestamp close to current time', () => {
      const beforeTime = new Date().getTime();
      const response = buildApiResponse({ id: '1' }, '/api/test');
      const afterTime = new Date().getTime();
      const responseTime = new Date(response.timestamp).getTime();
      
      expect(responseTime).toBeGreaterThanOrEqual(beforeTime);
      expect(responseTime).toBeLessThanOrEqual(afterTime);
    });
    
    it('should handle null data', () => {
      const response = buildApiResponse(null, '/api/test');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
    });
    
    it('should handle array data', () => {
      const testData = [{ id: '1' }, { id: '2' }];
      const response = buildApiResponse(testData, '/api/test');
      
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(2);
    });
    
    it('should handle empty array data', () => {
      const testData: any[] = [];
      const response = buildApiResponse(testData, '/api/test');
      
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(0);
    });
  });
  
  describe('buildErrorResponse', () => {
    
    it('should create an error response with all required fields', () => {
      const path = '/api/test/123';
      const status = 404;
      const message = 'Resource not found';
      
      const response = buildErrorResponse(path, status, message);
      
      expect(response.success).toBe(false);
      expect(response.status).toBe(status);
      expect(response.message).toBe(message);
      expect(response.data).toBeNull();
      expect(response.path).toBe(path);
      expect(response.timestamp).toBeDefined();
    });
    
    it('should generate valid ISO 8601 timestamp', () => {
      const response = buildErrorResponse('/api/test', 400, 'Bad request');
      
      expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
    
    it('should handle 400 Bad Request errors', () => {
      const response = buildErrorResponse('/api/test', 400, 'Invalid input');
      
      expect(response.success).toBe(false);
      expect(response.status).toBe(400);
    });
    
    it('should handle 404 Not Found errors', () => {
      const response = buildErrorResponse('/api/test/999', 404, 'Not found');
      
      expect(response.success).toBe(false);
      expect(response.status).toBe(404);
    });
    
    it('should handle 500 Internal Server Error', () => {
      const response = buildErrorResponse('/api/test', 500, 'Server error');
      
      expect(response.success).toBe(false);
      expect(response.status).toBe(500);
    });
    
    it('should always set data to null', () => {
      const response = buildErrorResponse('/api/test', 404, 'Not found');
      
      expect(response.data).toBeNull();
    });
    
    it('should generate timestamp close to current time', () => {
      const beforeTime = new Date().getTime();
      const response = buildErrorResponse('/api/test', 404, 'Not found');
      const afterTime = new Date().getTime();
      const responseTime = new Date(response.timestamp).getTime();
      
      expect(responseTime).toBeGreaterThanOrEqual(beforeTime);
      expect(responseTime).toBeLessThanOrEqual(afterTime);
    });
  });
  
  describe('Response Structure Validation', () => {
    
    it('buildApiResponse should return object matching ApiResponse interface', () => {
      const response = buildApiResponse({ id: '1' }, '/api/test');
      
      // Verify all required fields exist
      expect(response.success).toBeDefined();
      expect(response.status).toBeDefined();
      expect(response.message).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.timestamp).toBeDefined();
      expect(response.path).toBeDefined();
    });
    
    it('buildErrorResponse should return object matching ApiResponse interface', () => {
      const response = buildErrorResponse('/api/test', 404, 'Not found');
      
      // Verify all required fields exist
      expect(response.success).toBeDefined();
      expect(response.status).toBeDefined();
      expect(response.message).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.timestamp).toBeDefined();
      expect(response.path).toBeDefined();
    });
  });
});
