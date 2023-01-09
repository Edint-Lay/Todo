import helmet from "helmet";

export function getHelmetMiddleware() {
    return helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
      })
}