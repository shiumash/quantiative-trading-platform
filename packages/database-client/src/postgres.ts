import { Pool, PoolClient } from 'pg';
import { OHLCVData } from '@quant/shared-types';
import { validateOHLCVData, ValidationResult } from '@quant/shared-utils';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max?: number; // max connections in pool
}

export class PostgresClient {
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: config.max || 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async connect(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  // Market data specific methods
  async insertOHLCVData(data: OHLCVData[]): Promise<ValidationResult & { inserted: number }> {
    const errors: string[] = [];
    let inserted = 0;

    const client = await this.connect();
    
    try {
      await client.query('BEGIN');

      for (const record of data) {
        // Validate each record
        const validation = validateOHLCVData(record);
        if (!validation.isValid) {
          errors.push(`${record.symbol} at ${record.timestamp}: ${validation.errors.join(', ')}`);
          continue;
        }

        // Insert valid records
        try {
          await client.query(`
            INSERT INTO market_data.ohlcv 
            (symbol, timestamp, open, high, low, close, volume, adjusted_close, source)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (symbol, timestamp) DO UPDATE SET
              open = EXCLUDED.open,
              high = EXCLUDED.high,
              low = EXCLUDED.low,
              close = EXCLUDED.close,
              volume = EXCLUDED.volume,
              adjusted_close = EXCLUDED.adjusted_close,
              source = EXCLUDED.source
          `, [
            record.symbol,
            record.timestamp,
            record.open,
            record.high,
            record.low,
            record.close,
            record.volume,
            record.adjustedClose || null,
            'api' // default source
          ]);
          inserted++;
        } catch (dbError) {
          errors.push(`Database error for ${record.symbol}: ${dbError}`);
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      errors.push(`Transaction error: ${error}`);
    } finally {
      client.release();
    }

    return {
      isValid: errors.length === 0,
      errors,
      inserted
    };
  }

  async getOHLCVData(symbol: string, startDate: Date, endDate: Date): Promise<OHLCVData[]> {
    const result = await this.query(`
      SELECT symbol, timestamp, open, high, low, close, volume, adjusted_close
      FROM market_data.ohlcv
      WHERE symbol = $1 AND timestamp >= $2 AND timestamp <= $3
      ORDER BY timestamp ASC
    `, [symbol, startDate, endDate]);

    return result.rows.map(row => ({
      symbol: row.symbol,
      timestamp: row.timestamp,
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseInt(row.volume),
      adjustedClose: row.adjusted_close ? parseFloat(row.adjusted_close) : undefined
    }));
  }

  async getLatestPrice(symbol: string): Promise<OHLCVData | null> {
    const result = await this.query(`
      SELECT symbol, timestamp, open, high, low, close, volume, adjusted_close
      FROM market_data.ohlcv
      WHERE symbol = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `, [symbol]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      symbol: row.symbol,
      timestamp: row.timestamp,
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseInt(row.volume),
      adjustedClose: row.adjusted_close ? parseFloat(row.adjusted_close) : undefined
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health');
      return result.rows[0].health === 1;
    } catch {
      return false;
    }
  }
}