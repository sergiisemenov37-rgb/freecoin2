export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private isDevelopment: boolean = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const contextStr = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
    const userStr = entry.userId ? ` [User: ${entry.userId}]` : '';
    return `[${entry.timestamp}] ${entry.level}${userStr}: ${entry.message}${contextStr}`;
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, any>, userId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId
    };

    this.logs.push(entry);

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const formatted = this.formatMessage(entry);
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.ERROR:
          console.error(formatted);
          break;
      }
    }
  }

  debug(message: string, context?: Record<string, any>, userId?: string) {
    this.addLog(LogLevel.DEBUG, message, context, userId);
  }

  info(message: string, context?: Record<string, any>, userId?: string) {
    this.addLog(LogLevel.INFO, message, context, userId);
  }

  warn(message: string, context?: Record<string, any>, userId?: string) {
    this.addLog(LogLevel.WARN, message, context, userId);
  }

  error(message: string, context?: Record<string, any>, userId?: string) {
    this.addLog(LogLevel.ERROR, message, context, userId);
  }

  getLogs(level?: LogLevel, userId?: string): LogEntry[] {
    let filtered = this.logs;

    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (userId) {
      filtered = filtered.filter(log => log.userId === userId);
    }

    return filtered;
  }

  clearLogs() {
    this.logs = [];
  }

  getLogCount(): number {
    return this.logs.length;
  }
}

export const logger = new Logger();
