import tailwind from "bun-plugin-tailwind"

await Bun.$`rm -r dist`
await Bun.build({
    plugins: [tailwind],
    outdir: "dist",
    entrypoints: ["index.html"],
    target: "browser",
    sourcemap: "linked",
    minify: true,
})
await Bun.$`cp -r public/* dist/`
