interface ErrorType extends Error {
  code?: number;
  keyPattern?: { [key: string]: number };
}
export default ErrorType;
