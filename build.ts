import tailwind from "bun-plugin-tailwind"

await Bun.$`rm -r dist`
await Bun.build({
    plugins: [tailwind],
    outdir: "dist",
    entrypoints: ["index.html"],
    target: "browser",
    sourcemap: "linked",
    minify: true,
    naming: {
        entry: "[name].[ext]",
        chunk: "assets/[name].[hash]",
        asset: "assets/[name].[hash].[ext]"
    }
})
await Bun.$`cp -r public/* dist/`
