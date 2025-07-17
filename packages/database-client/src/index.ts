// Database client exports
export * from './postgres';
export * from './redis';

// Import classes for factory functions
import { PostgresClient } from './postgres';
import { RedisClient } from './redis';

// Default configurations for development
export const DEFAULT_POSTGRES_CONFIG = {
    host: 'localhost',
    port: 5432,
    database: 'quant_dev',
    user: 'quant_user',
    password: 'quant_pass',
    max: 20
};

export const DEFAULT_REDIS_CONFIG = {
    host: 'localhost',
    port: 6379,
    db: 0
};

// Factory functions for easy setup
export function createPostgresClient(config = DEFAULT_POSTGRES_CONFIG) {
    return new PostgresClient(config);
}

export function createRedisClient(config = DEFAULT_REDIS_CONFIG) {
    return new RedisClient(config);
}