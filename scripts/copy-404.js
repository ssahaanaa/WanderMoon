// GitHub Pages has no "send every URL to index.html" setting.
// If someone refreshes /packages, GitHub looks for a file called 404.html instead.
// Giving it a copy of index.html lets the React app load and show the right page.
import { copyFileSync } from "node:fs";

copyFileSync("dist/index.html", "dist/404.html");
console.log("Created dist/404.html (for GitHub Pages)");
