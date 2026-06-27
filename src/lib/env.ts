// Runtime environment configuration.

interface EnvConfig {
  appName: string;
  appUrl: string;
  openclawApiUrl: string;
  openclawApiKey: string | undefined;
  dockerHost: string;
}

export function getEnv(): EnvConfig {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME || "Kani",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    openclawApiUrl: process.env.OPENCLAW_API_URL || "http://localhost:8080",
    openclawApiKey: process.env.OPENCLAW_API_KEY,
    dockerHost: process.env.DOCKER_HOST || "unix:///var/run/docker.sock",
  };
}