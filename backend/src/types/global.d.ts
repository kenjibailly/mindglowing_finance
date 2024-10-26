// global.d.ts
declare namespace logger {
  // Define the Logger interface to include method signatures
  export interface Logger {
    log(...args: any[]): void;
    info(...args: any[]): void;
    success(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
  }
}

// Declare the global variable with the correct type
declare var logger: logger.Logger;
