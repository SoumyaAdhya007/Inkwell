import { da } from "zod/v4/locales/index.cjs";

class ApiResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: any;
  constructor(statusCode: number, message: string = "Success", data: any) {
    (this.statusCode = statusCode),
      (this.success = statusCode < 400),
      (this.message = message),
      (this.data = data);
  }
}

export default ApiResponse;
