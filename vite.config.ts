import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import linaria from "@linaria/rollup";
import replace from "@rollup/plugin-replace";
import inject from "@rollup/plugin-inject";

export default defineConfig({
  logLevel: "info",
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/api": "https://dev-panoton.spellbrand.io",
    },
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "https://dev-panoton.spellbrand.io",
      },
    },
  },
  build: { target: "esnext" },
  plugins: [
    solidPlugin(),
    tsconfigPaths(),
    replace({
      "tw`": `css\`@apply${" "}`,
      preventAssignment: true,
    }),
    inject({
      css: ["@linaria/core", "css"],
      exclude: ["**/*.html", "**/*.css"],
    }),
    linaria({
      exclude: ["**/*.html", "**/*.css"],
    }),
  ],
});
