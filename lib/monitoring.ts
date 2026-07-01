import { logger, LogLevel } from './logger';

export interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  success: boolean;
}

class MonitoringService {
  private metrics: Map<string, number[]> = new Map();
  private performanceMetrics: PerformanceMetric[] = [];
  private maxMetrics: number = 10000;

  incrementMetric(name: string, value: number = 1, tags?: Record<string, string>) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
    
    logger.debug(`Metric incremented: ${name}`, { value, tags });
  }

  getMetric(name: string): { count: number; sum: number; avg: number; min: number; max: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    return {
      count: values.length,
      sum,
      avg: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  recordPerformance(name: string, duration: number, success: boolean = true) {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      success
    };

    this.performanceMetrics.push(metric);

    // Keep only last maxMetrics entries
    if (this.performanceMetrics.length > this.maxMetrics) {
      this.performanceMetrics.shift();
    }

    if (!success) {
      logger.warn(`Performance metric failed: ${name}`, { duration });
    }
  }

  getPerformanceMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.performanceMetrics.filter(m => m.name === name);
    }
    return this.performanceMetrics;
  }

  getAveragePerformance(name: string): number | null {
    const metrics = this.getPerformanceMetrics(name);
    if (metrics.length === 0) return null;

    const sum = metrics.reduce((a, b) => a + b.duration, 0);
    return sum / metrics.length;
  }

  getPerformancePercentile(name: string, percentile: number): number | null {
    const metrics = this.getPerformanceMetrics(name);
    if (metrics.length === 0) return null;

    const sorted = metrics.map(m => m.duration).sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  trackAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    return fn()
      .then(result => {
        const duration = Date.now() - start;
        this.recordPerformance(name, duration, true);
        return result;
      })
      .catch(error => {
        const duration = Date.now() - start;
        this.recordPerformance(name, duration, false);
        logger.error(`Async function failed: ${name}`, { error: error.message });
        throw error;
      });
  }

  clearMetrics() {
    this.metrics.clear();
    this.performanceMetrics = [];
  }

  getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [name, values] of this.metrics.entries()) {
      result[name] = this.getMetric(name);
    }

    return result;
  }
}

export const monitoring = new MonitoringService();

// Performance tracking decorator
export function trackPerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;
        monitoring.recordPerformance(name, duration, true);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        monitoring.recordPerformance(name, duration, false);
        logger.error(`Method failed: ${name}`, { error });
        throw error;
      }
    };

    return descriptor;
  };
}
