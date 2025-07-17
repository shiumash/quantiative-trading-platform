// User Management and Authentication Types

export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    lastLoginAt?: Date;
}

export type UserRole =
    | 'ADMIN'           // Full system access
    | 'RESEARCHER'      // Can create/edit strategies
    | 'VIEWER'          // Read-only access
    | 'TRADER';         // Can execute trades

export interface AuthToken {
    token: string;
    refreshToken: string;
    expiresAt: Date;
    userId: string;
    role: UserRole;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface Permission {
    resource: string;      // e.g., 'strategy', 'portfolio', 'market-data'
    action: string;        // e.g., 'read', 'write', 'delete', 'execute'
    granted: boolean;
}

// For collaboration features
export interface StrategyShare {
    id: string;
    strategyId: string;
    ownerId: string;       // Who owns the strategy
    sharedWithId: string;  // Who it's shared with
    permissions: Permission[];
    sharedAt: Date;
    expiresAt?: Date;
}

export interface UserActivity {
    id: string;
    userId: string;
    action: string;        // e.g., 'login', 'create_strategy', 'run_backtest'
    resource?: string;     // What was acted upon
    metadata?: any;        // Additional context
    timestamp: Date;
    ipAddress?: string;
}