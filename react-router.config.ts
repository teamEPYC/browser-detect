import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "app",
  ssr: true,
  buildDirectory: "dist",
  serverBuildFile: "server/index.js",
  serverModuleFormat: "esm",
} satisfies Config;