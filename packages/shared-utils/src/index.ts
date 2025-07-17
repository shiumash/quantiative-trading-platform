// Main exports for shared utilities package

export * from './validation';
export * from './math';

// API utility functions
export function createSuccessResponse<T>(data: T, requestId: string = generateRequestId()) {
  return {
    success: true,
    data,
    timestamp: new Date(),
    requestId
  };
}

export function createErrorResponse(code: string, message: string, details?: any, requestId: string = generateRequestId()) {
  return {
    success: false,
    error: {
      code,
      message,
      details
    },
    timestamp: new Date(),
    requestId
  };
}

// Generate unique request ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Date utilities
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date;
}

// Get trading days between two dates (excludes weekends)
export function getTradingDaysBetween(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

// Sleep utility for rate limiting
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}