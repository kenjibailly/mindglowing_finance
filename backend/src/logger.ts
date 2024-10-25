// logger.ts
class Logger {
  private stat: string;

  constructor(stat: string) {
    this.stat = stat;
  }

  log(...args: any[]): void {
    process.stdout.write(`${this.stat}: `);
    this._writeMessage(...args); // print message
    process.stdout.write(`\n`);
  }

  info(...args: any[]): void {
    process.stdout.write("\x1b[34m"); // set color to blue
    process.stdout.write(`${this.stat}: `);
    this._writeMessage(...args); // print message
    process.stdout.write("\x1b[0m\n"); // reset color
  }

  success(...args: any[]): void {
    process.stdout.write("\x1b[32m"); // set color to green
    process.stdout.write(`${this.stat}: `);
    this._writeMessage(...args); // print message
    process.stdout.write("\x1b[0m\n"); // reset color
  }

  error(...args: any[]): void {
    process.stdout.write("\x1b[31m"); // set color to red
    process.stdout.write(`${this.stat}: `);
    this._writeMessage(...args); // print error message
    process.stdout.write("\x1b[0m\n"); // reset color
  }

  warn(...args: any[]): void {
    process.stdout.write("\x1b[33m"); // set color to yellow
    process.stdout.write(`${this.stat}: `);
    this._writeMessage(...args); // print message
    process.stdout.write("\x1b[0m\n"); // reset color
  }

  private async _writeMessage(...args: any[]): Promise<void> {
    for (const arg of args) {
      if (arg instanceof Error) {
        process.stdout.write(`${arg.message}\n${arg.stack} `);
      } else if (arg instanceof Map) {
        process.stdout.write(
          `\n${JSON.stringify(Array.from(arg.entries()), null, 2)} \n`
        );
      } else if (
        typeof arg === "object" &&
        typeof (arg as Promise<any>).then === "function"
      ) {
        try {
          const result = await arg; // Await the promise resolution
          process.stdout.write(
            `\nResolved Promise: ${JSON.stringify(result, null, 2)} \n`
          );
        } catch (error) {
          process.stdout.write(`\nRejected Promise: ${error} \n`);
        }
      } else if (typeof arg === "object") {
        process.stdout.write(`\n${JSON.stringify(arg, null, 2)} \n`);
      } else {
        process.stdout.write(`${arg} `);
      }
    }
  }
}

const logger = new Logger("Finance Backend");

export default logger;
