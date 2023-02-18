const config = {
  bundle: true,
  platform: "node",
  sourcemap: true,
  packages: "external",
  outfile: "dist/index.js",
};

require("esbuild").buildSync({
  entryPoints: ["src/index.ts"],
  ...config,
});
