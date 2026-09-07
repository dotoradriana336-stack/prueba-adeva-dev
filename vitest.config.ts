import { fileURLToPath, URL } from "node:url";

import { mergeConfig, defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: "happy-dom",
			globals: true,
			include: ["src/**/*.spec.ts"],
			coverage: {
				provider: "v8",
				reporter: ["text", "html"],
				include: ["src/http/**", "src/services/**", "src/stores/**", "src/utils/**"]
			}
		},
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url))
			}
		}
	})
);
