interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

interface UserMetrics {
  userId: string;
  sessionDuration: number;
  pageViews: number;
  errors: number;
  lastActive: string;
}

class MonitoringService {
  private metrics: PerformanceMetric[] = [];
  private userMetrics: Map<string, UserMetrics> = new Map();
  private sessionStart = Date.now();

  recordMetric(name: string, value: number, unit: string = 'ms'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
    };
    this.metrics.push(metric);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }

    // Send to backend if critical
    if (value > 3000) {
      this.reportSlowMetric(metric);
    }
  }

  recordPageView(page: string): void {
    this.recordMetric(`pageview:${page}`, 1, 'count');
  }

  recordApiCall(endpoint: string, duration: number, success: boolean): void {
    this.recordMetric(`api:${endpoint}:${success ? 'success' : 'error'}`, duration, 'ms');
  }

  recordError(error: Error, context: string): void {
    this.recordMetric(`error:${context}`, 1, 'count');
    this.reportError({ error: error.message, stack: error.stack, context });
  }

  private reportSlowMetric(metric: PerformanceMetric): void {
    if (typeof window !== 'undefined') {
      fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'slow_metric', data: metric }),
      }).catch(err => console.error('Failed to report metric:', err));
    }
  }

  private reportError(data: any): void {
    if (typeof window !== 'undefined') {
      fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'error', data }),
      }).catch(err => console.error('Failed to report error:', err));
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getSessionDuration(): number {
    return Date.now() - this.sessionStart;
  }
}

export const monitoringService = new MonitoringService();
