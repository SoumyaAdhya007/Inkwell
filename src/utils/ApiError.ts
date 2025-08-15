class ApiError extends Error {
  statusCode?: number;
  success?: boolean;
  message: string;
  error?: any[];
  data?: any;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    error: any[] = [],
    data: any=null,
    stack: string = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.success = false),
      (this.message = message),
      (this.error = error),
      (this.data = data || null);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
