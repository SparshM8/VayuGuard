/** Base application error carrying an explicit HTTP status code for safe API error responses. */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

/** Raised when a requested city or atmospheric station cannot be resolved. */
export class CityNotFoundError extends AppError {
  constructor(city: string) {
    super(`City "${city}" not found. Please verify spelling or try a nearby major city.`, 404);
  }
}

/** Raised when an upstream weather/air-quality provider fails or times out. */
export class UpstreamServiceError extends AppError {
  constructor(serviceName: string, status?: number) {
    const detail = status ? `returned status ${status}` : 'is temporarily unavailable';
    super(`${serviceName} ${detail}. Please try again shortly.`, 502);
  }
}
