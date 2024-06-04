declare namespace NodeJS {
  export interface ProcessEnv {
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    REDIS_DB_NUMBER: string;
    KAFKA1: string;
    KAFKA1_PORT: string;
    COOKIE_PARSER_SECRET: string;
    EMAIL_NAME: string;
    SCHEMA_REGISTRY_URL: string;
    TYPEORM_CONNECTION: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    TYPEORM_DATABASE: string;
    TYPEORM_LOGGING:string;
    CERT_PASSPHRASE: string;
    NODE_ENV: string;
    COOKIE_DOMAIN:string
  }
}
