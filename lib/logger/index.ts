import prisma from '@/lib/db/prisma';
import { LogSeverity } from '@prisma/client';

export interface LogPayload {
  requestId: string;
  event: string;
  route: string;
  method: string;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown> | null;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'secret',
  'apikey',
  'authorization',
  'cookie',
  'session',
  'accesstoken',
  'refreshtoken',
  'authheader',
]);

/**
 * Recursively deep-redacts sensitive fields from objects, arrays, and JSON structures
 */
export function redactSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item));
  }

  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey) || lowerKey.includes('password') || lowerKey.includes('secret') || lowerKey.includes('token')) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = redactSensitiveData(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return String(data);
}

class SecurityLogger {
  private async persistLog(severity: LogSeverity, payload: LogPayload) {
    const redactedDetails = payload.details
      ? (redactSensitiveData(payload.details) as Record<string, unknown>)
      : undefined;

    // Structured Server Console Output
    const timestamp = new Date().toISOString();
    const consolePrefix = `[VESTRA AUDIT][${severity}][${timestamp}]`;
    const logSummary = `${payload.method} ${payload.route} | Event: ${payload.event} | Req: ${payload.requestId}`;

    if (severity === LogSeverity.ERROR) {
      console.error(`${consolePrefix} ${logSummary}`, redactedDetails || '');
    } else if (severity === LogSeverity.WARN || severity === LogSeverity.SECURITY) {
      console.warn(`${consolePrefix} ${logSummary}`, redactedDetails || '');
    } else {
      console.info(`${consolePrefix} ${logSummary}`, redactedDetails || '');
    }

    // Persist to PostgreSQL SecurityAuditLog
    try {
      return await prisma.securityAuditLog.create({
        data: {
          requestId: payload.requestId,
          severity,
          event: payload.event,
          route: payload.route,
          method: payload.method,
          userId: payload.userId || null,
          ipAddress: payload.ipAddress || null,
          userAgent: payload.userAgent || null,
          details: redactedDetails ? (redactedDetails as object) : undefined,
        },
      });
    } catch (err) {
      console.error('[SecurityLogger] Failed to persist audit log to database:', err);
      return null;
    }
  }

  async logInfo(payload: LogPayload) {
    return this.persistLog(LogSeverity.INFO, payload);
  }

  async logWarn(payload: LogPayload) {
    return this.persistLog(LogSeverity.WARN, payload);
  }

  async logSecurity(payload: LogPayload) {
    return this.persistLog(LogSeverity.SECURITY, payload);
  }

  async logError(payload: LogPayload) {
    return this.persistLog(LogSeverity.ERROR, payload);
  }
}

export const logger = new SecurityLogger();
