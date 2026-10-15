import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mockApiPlugin } from "./server/mockApi.js";

// SECURITY headers sent with every page.
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// Content Security Policy: the page may only load scripts from itself.
// Used for "npm run preview" (the built app). The dev server needs inline
// scripts for hot reload, so it only gets the simple headers above.
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  server: { headers: securityHeaders },
  preview: { headers: { ...securityHeaders, "Content-Security-Policy": csp } },
  build: {
    rollupOptions: {
      output: {
        // Libraries that rarely change go in their own files, so the browser keeps them cached
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          state: ["@reduxjs/toolkit", "react-redux", "zustand"],
          http: ["axios"],
        },
      },
    },
  },
});
