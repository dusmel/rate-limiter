import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const loadEnvVariable = (envName) => {
  const env = process.env[envName];
  if (env == null) {
    console.error(`Environment variable => ${envName} is undefined.`);
  }
  return env;
};

const config = {
  APP: {
    PORT: loadEnvVariable('PORT') || 8080,
    REDIS_URL: loadEnvVariable('REDIS_URL_DOCKER') || 'redis://localhost:6379'
  }
};

export default config;
