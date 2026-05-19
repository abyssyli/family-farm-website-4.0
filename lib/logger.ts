import * as Sentry from "@sentry/nextjs";

type LogLevel = "info" | "warn" | "error"

export function logEvent(level: LogLevel, message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
  }

  if (process.env.NODE_ENV === "production") {
    // Send to Sentry if it's an error or warning
    if (level === "error") {
      Sentry.captureException(data?.error || message, {
        extra: logEntry,
      });
    } else if (level === "warn") {
      Sentry.captureMessage(message, {
        level: "warning",
        extra: logEntry,
      });
    }
    console.log(JSON.stringify(logEntry))
  } else {
    console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || "")
  }
}

export function logError(message: string, error: any) { [modified]
  logEvent("error", message, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  })
}