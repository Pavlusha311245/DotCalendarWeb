import tailwind from "bun-plugin-tailwind";

// Remove dist folder if it exists
const distPath = new URL("dist", import.meta.url);
if (await Bun.file(distPath).exists()) {
  await Bun.$`rm -r dist`;
}

await Bun.build({
  plugins: [tailwind],
  outdir: "dist",
  entrypoints: ["index.html"],
  target: "browser",
  sourcemap: "linked",
  minify: true,
});
await Bun.$`cp -r public/* dist/`;

console.log(`✓ Build complete`);
