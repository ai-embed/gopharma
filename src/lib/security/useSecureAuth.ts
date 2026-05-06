"use client";

import { useState, useCallback, useMemo } from "react";
import { RateLimiter, RATE_LIMIT_CONFIGS } from "./rateLimiter";

interface SecureAuthState {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutSeconds: number;
  remainingLockoutMinutes: number;
}

interface AuthAttemptCheck {
  canProceed: boolean;
  error?: string;
}

/**
 * Hook pour sécuriser l'authentification avec rate limiting
 */
export function useSecureAuth(identifier: string) {
  const limiter = useMemo(
    () => new RateLimiter(identifier, RATE_LIMIT_CONFIGS.auth),
    [identifier]
  );

  const [authState, setAuthState] = useState<SecureAuthState>(() => {
    const check = limiter.check();
    return {
      isLocked: !check.canProceed,
      remainingAttempts: check.remainingAttempts,
      lockoutSeconds: check.lockoutSeconds,
      remainingLockoutMinutes: Math.ceil(check.lockoutSeconds / 60),
    };
  });

  /**
   * Vérifie si l'utilisateur peut tenter une connexion
   */
  const checkAuthAttempt = useCallback((): AuthAttemptCheck => {
    const check = limiter.check();

    setAuthState({
      isLocked: !check.canProceed,
      remainingAttempts: check.remainingAttempts,
      lockoutSeconds: check.lockoutSeconds,
      remainingLockoutMinutes: Math.ceil(check.lockoutSeconds / 60),
    });

    if (!check.canProceed) {
      return {
        canProceed: false,
        error: limiter.getLockoutMessage(check.lockoutSeconds),
      };
    }

    return { canProceed: true };
  }, [limiter]);

  /**
   * Enregistre le résultat d'une tentative (succès ou échec)
   */
  const recordAuthAttempt = useCallback(
    (success: boolean): void => {
      if (success) {
        limiter.recordSuccess();
        setAuthState({
          isLocked: false,
          remainingAttempts: 5,
          lockoutSeconds: 0,
          remainingLockoutMinutes: 0,
        });
      } else {
        limiter.recordFailure();
        const check = limiter.check();
        setAuthState({
          isLocked: !check.canProceed,
          remainingAttempts: check.remainingAttempts,
          lockoutSeconds: check.lockoutSeconds,
          remainingLockoutMinutes: Math.ceil(check.lockoutSeconds / 60),
        });
      }
    },
    [limiter]
  );

  return {
    authState,
    checkAuthAttempt,
    recordAuthAttempt,
  };
}

/**
 * Hook pour la réinitialisation de mot de passe avec rate limiting strict
 */
export function useSecurePasswordReset(identifier: string) {
  const limiter = useMemo(
    () => new RateLimiter(identifier, RATE_LIMIT_CONFIGS.passwordReset),
    [identifier]
  );

  const [resetState, setResetState] = useState<SecureAuthState>(() => {
    const check = limiter.check();
    return {
      isLocked: !check.canProceed,
      remainingAttempts: check.remainingAttempts,
      lockoutSeconds: check.lockoutSeconds,
      remainingLockoutMinutes: Math.ceil(check.lockoutSeconds / 60),
    };
  });

  const checkResetAttempt = useCallback((): AuthAttemptCheck => {
    const check = limiter.check();

    setResetState({
      isLocked: !check.canProceed,
      remainingAttempts: check.remainingAttempts,
      lockoutSeconds: check.lockoutSeconds,
      remainingLockoutMinutes: Math.ceil(check.lockoutSeconds / 60),
    });

    if (!check.canProceed) {
      return {
        canProceed: false,
        error: limiter.getLockoutMessage(check.lockoutSeconds),
      };
    }

    return { canProceed: true };
  }, [limiter]);

  const recordResetAttempt = useCallback(
    (success: boolean): void => {
      if (success) {
        limiter.recordSuccess();
        setResetState({
          isLocked: false,
          remainingAttempts: 3,
          lockoutSeconds: 0,
          remainingLockoutMinutes: 0,
        });
      } else {
        limiter.recordFailure();
        const check = limiter.check();
        setResetState({
          isLocked: !check.canProceed,
          remainingAttempts: check.remainingAttempts,
          lockoutSeconds: check.lockoutSeconds,
          remainingLockoutMinutes: Math.ceil(check.lockoutSeconds / 60),
        });
      }
    },
    [limiter]
  );

  return {
    resetState,
    checkResetAttempt,
    recordResetAttempt,
  };
}
