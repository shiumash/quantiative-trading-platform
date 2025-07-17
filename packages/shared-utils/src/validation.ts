import { OHLCVData, TimeInterval, TradingStrategy } from '@quant/shared-types';

// Validation utilities for data integrity

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateOHLCVData(data: OHLCVData): ValidationResult {
  const errors: string[] = [];

  // Basic field validation
  if (!data.symbol || data.symbol.trim() === '') {
    errors.push('Symbol is required');
  }

  if (!data.timestamp || isNaN(data.timestamp.getTime())) {
    errors.push('Valid timestamp is required');
  }

  // Price validation - prices should be positive
  if (data.open <= 0) errors.push('Open price must be positive');
  if (data.high <= 0) errors.push('High price must be positive');
  if (data.low <= 0) errors.push('Low price must be positive');
  if (data.close <= 0) errors.push('Close price must be positive');

  // Volume should be non-negative
  if (data.volume < 0) errors.push('Volume cannot be negative');

  // OHLC relationship validation
  if (data.high < data.low) {
    errors.push('High price cannot be less than low price');
  }
  if (data.high < data.open || data.high < data.close) {
    errors.push('High price must be >= open and close prices');
  }
  if (data.low > data.open || data.low > data.close) {
    errors.push('Low price must be <= open and close prices');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateTimeInterval(interval: string): interval is TimeInterval {
  const validIntervals: TimeInterval[] = ['1min', '5min', '15min', '1hour', '1day', '1week', '1month'];
  return validIntervals.includes(interval as TimeInterval);
}

export function validateTradingStrategy(strategy: Partial<TradingStrategy>): ValidationResult {
  const errors: string[] = [];

  if (!strategy.name || strategy.name.trim() === '') {
    errors.push('Strategy name is required');
  }

  if (!strategy.code || strategy.code.trim() === '') {
    errors.push('Strategy code is required');
  }

  if (!strategy.createdBy || strategy.createdBy.trim() === '') {
    errors.push('Strategy creator is required');
  }

  // Validate parameters if they exist
  if (strategy.parameters) {
    strategy.parameters.forEach((param, index) => {
      if (!param.name || param.name.trim() === '') {
        errors.push(`Parameter ${index + 1}: name is required`);
      }
      if (!['number', 'string', 'boolean'].includes(param.type)) {
        errors.push(`Parameter ${index + 1}: invalid type`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password strength validation
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}