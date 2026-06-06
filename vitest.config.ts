import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^react\/jsx-runtime$/,
        replacement: fileURLToPath(new URL("./node_modules/react/jsx-runtime.js", import.meta.url)),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: fileURLToPath(new URL("./node_modules/react/jsx-dev-runtime.js", import.meta.url)),
      },
      {
        find: /^react$/,
        replacement: fileURLToPath(new URL("./node_modules/react/index.js", import.meta.url)),
      },
      {
        find: /^react-dom\/client$/,
        replacement: fileURLToPath(new URL("./node_modules/react-dom/client.js", import.meta.url)),
      },
      {
        find: /^react-dom\/test-utils$/,
        replacement: fileURLToPath(new URL("./node_modules/react-dom/test-utils.js", import.meta.url)),
      },
      {
        find: /^react-dom$/,
        replacement: fileURLToPath(new URL("./node_modules/react-dom/index.js", import.meta.url)),
      },
      {
        find: "@sdkwork/ui-pc-react/theme",
        replacement: fileURLToPath(new URL("../../javasource/spring-ai-plus/spring-ai-plus-business/apps/sdkwork-ui/sdkwork-ui-pc-react/dist/theme.js", import.meta.url)),
      },
      {
        find: "@sdkwork/ui-pc-react",
        replacement: fileURLToPath(new URL("../../javasource/spring-ai-plus/spring-ai-plus-business/apps/sdkwork-ui/sdkwork-ui-pc-react/dist/index.js", import.meta.url)),
      },
      {
        find: "@sdkwork/core-pc-react",
        replacement: fileURLToPath(new URL("../../javasource/spring-ai-plus/spring-ai-plus-business/apps/sdkwork-core/sdkwork-core-pc-react/dist/index.js", import.meta.url)),
      },
      {
        find: "@sdkwork/audio-pc-react",
        replacement: fileURLToPath(new URL("./packages/pc-react/content/sdkwork-audio-pc-react/src/index.ts", import.meta.url)),
      },
      {
        find: "@sdkwork/media-pc-react",
        replacement: fileURLToPath(new URL("./packages/pc-react/content/sdkwork-media-pc-react/src/index.ts", import.meta.url)),
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: [
      "packages/**/*.test.ts",
      "packages/**/*.test.tsx"
    ],
    setupFiles: ["./vitest.setup.ts"]
  }
});
