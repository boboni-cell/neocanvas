import { Container } from "@cloudflare/containers";
import { env } from "cloudflare:workers";

export class NeoCanvasContainer extends Container {
  defaultPort = 3000;
  sleepAfter = "10m";
  envVars = {
    ADMIN_USERNAME: env.ADMIN_USERNAME,
    ADMIN_PASSWORD: env.ADMIN_PASSWORD,
    JWT_SECRET: env.JWT_SECRET,
    JWT_EXPIRE_HOURS: "168",
    STORAGE_DRIVER: "postgresql",
    DATABASE_DSN: env.DATABASE_DSN,
    PUBLIC_BASE_URL: "https://neocanvas.hanyue-room.design",
  };
}

export default {
  fetch(request, env) {
    return env.NEOCANVAS_CONTAINER.getByName("production").fetch(request);
  },
};
