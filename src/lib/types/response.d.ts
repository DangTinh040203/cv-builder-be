export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[] | object;
  timestamp: string;
  path: string;
}
