/**
 * Swagger/OpenAPI configuration options.
 */
export interface SwaggerConfig {
  /**
   * Title of the API documentation
   */
  title: string;

  /**
   * Description of the API
   */
  description: string;

  /**
   * API version
   */
  version: string;

  /**
   * Path where Swagger UI will be served (e.g., 'docs')
   */
  path: string;
}
