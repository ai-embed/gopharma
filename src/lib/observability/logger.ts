/**
 * Logger structuré pour production
 * Génère des logs JSON avec correlation ID pour le tracing
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  traceId?: string;
  userId?: string;
  path?: string;
  method?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LOG_LEVEL = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) ?? "info";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[MIN_LOG_LEVEL];
}

function generateTraceId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

function createLogEntry(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return entry;
}

function outputLog(entry: LogEntry): void {
  if (typeof window === "undefined") {
    // Server-side: output JSON for log aggregation
    console.log(JSON.stringify(entry));
  } else {
    // Client-side: use console with colors for readability
    const colors: Record<LogLevel, string> = {
      debug: "color: #6B7280",
      info: "color: #0B63D1",
      warn: "color: #D97706",
      error: "color: #DC2626; font-weight: bold",
    };

    const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}:`;
    const traceInfo = entry.context?.traceId ? ` [${entry.context.traceId}]` : "";

    if (entry.error) {
      console.groupCollapsed(`%c${prefix}${traceInfo} ${entry.message}`, colors[entry.level]);
      console.log("Context:", entry.context);
      console.error("Error:", entry.error);
      console.groupEnd();
    } else {
      console.log(`%c${prefix}${traceInfo} ${entry.message}`, colors[entry.level], entry.context ?? "");
    }
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (shouldLog("debug")) {
      outputLog(createLogEntry("debug", message, context));
    }
  },

  info: (message: string, context?: LogContext) => {
    if (shouldLog("info")) {
      outputLog(createLogEntry("info", message, context));
    }
  },

  warn: (message: string, context?: LogContext, error?: Error) => {
    if (shouldLog("warn")) {
      outputLog(createLogEntry("warn", message, context, error));
    }
  },

  error: (message: string, context?: LogContext, error?: Error) => {
    if (shouldLog("error")) {
      outputLog(createLogEntry("error", message, context, error));
    }
  },

  generateTraceId,
};

// Store trace ID in memory for the current request
let currentTraceId: string | null = null;

export function setTraceId(traceId: string): void {
  currentTraceId = traceId;
}

export function getTraceId(): string {
  if (!currentTraceId) {
    currentTraceId = generateTraceId();
  }
  return currentTraceId;
}

export function clearTraceId(): void {
  currentTraceId = null;
}

export function withTraceId<T>(fn: () => T): T {
  const traceId = generateTraceId();
  setTraceId(traceId);
  try {
    return fn();
  } finally {
    clearTraceId();
  }
}
