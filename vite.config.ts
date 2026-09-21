import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The base path should be wherever the dist should be outputted to on github pages.
// If it's a standalone site without a domain, it should be the name of the repo
// However, in our case, we have a custom domain, so it's just the root! https://github.com/vitejs/vite/discussions/13910
export default defineConfig({
  plugins: [react()],
  base: "/",
});
