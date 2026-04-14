/**
 * Client-side Rate Limiter
 * Protection contre brute-force sur formulaires d'authentification
 */

interface RateLimiterConfig {
  maxAttempts: number;
  windowMs: number;    // Time window in milliseconds
  lockoutMs: number;   // Lockout duration after exceeding max attempts
}

interface RateLimiterState {
  attempts: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,  // 15 minutes
  lockoutMs: 30 * 60 * 1000, // 30 minutes
};

export class RateLimiter {
  private config: RateLimiterConfig;
  private storageKey: string;

  constructor(identifier: string, config: Partial<RateLimiterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.storageKey = `rate_limit_${identifier}`;
  }

  private getState(): RateLimiterState {
    if (typeof window === "undefined") {
      return { attempts: 0, firstAttempt: 0, lockedUntil: null };
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }

    return { attempts: 0, firstAttempt: 0, lockedUntil: null };
  }

  private setState(state: RateLimiterState): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Check if the operation can proceed
   * @returns { canProceed: boolean, remainingAttempts: number, lockoutSeconds: number }
   */
  check(): { canProceed: boolean; remainingAttempts: number; lockoutSeconds: number } {
    const now = Date.now();
    const state = this.getState();

    // Check if currently locked out
    if (state.lockedUntil && now < state.lockedUntil) {
      const lockoutSeconds = Math.ceil((state.lockedUntil - now) / 1000);
      return { canProceed: false, remainingAttempts: 0, lockoutSeconds };
    }

    // Clear expired lockout
    if (state.lockedUntil && now >= state.lockedUntil) {
      state.lockedUntil = null;
      state.attempts = 0;
      this.setState(state);
    }

    // Check if window has expired
    if (state.firstAttempt && now - state.firstAttempt > this.config.windowMs) {
      state.attempts = 0;
      state.firstAttempt = now;
      this.setState(state);
    }

    // Initialize first attempt if needed
    if (!state.firstAttempt) {
      state.firstAttempt = now;
      this.setState(state);
    }

    const remainingAttempts = Math.max(0, this.config.maxAttempts - state.attempts);
    const canProceed = remainingAttempts > 0;

    return { canProceed, remainingAttempts, lockoutSeconds: 0 };
  }

  /**
   * Record a failed attempt
   */
  recordFailure(): void {
    const now = Date.now();
    const state = this.getState();

    state.attempts += 1;

    // Check if we should lockout
    if (state.attempts >= this.config.maxAttempts) {
      state.lockedUntil = now + this.config.lockoutMs;
    }

    this.setState(state);
  }

  /**
   * Record a successful attempt (resets counter)
   */
  recordSuccess(): void {
    this.setState({ attempts: 0, firstAttempt: 0, lockedUntil: null });
  }

  /**
   * Get formatted lockout message
   */
  getLockoutMessage(lockoutSeconds: number): string {
    const minutes = Math.ceil(lockoutSeconds / 60);
    return `Trop de tentatives. Réessayez dans ${minutes} minute(s).`;
  }

  /**
   * Reset the rate limiter (for testing or manual unlock)
   */
  reset(): void {
    this.setState({ attempts: 0, firstAttempt: 0, lockedUntil: null });
  }
}

// Predefined configurations
export const RATE_LIMIT_CONFIGS = {
  auth: { maxAttempts: 5, windowMs: 15 * 60 * 1000, lockoutMs: 30 * 60 * 1000 },
  passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000, lockoutMs: 60 * 60 * 1000 },
  api: { maxAttempts: 100, windowMs: 60 * 1000, lockoutMs: 5 * 60 * 1000 },
} as const;

export type RateLimitConfigKey = keyof typeof RATE_LIMIT_CONFIGS;
