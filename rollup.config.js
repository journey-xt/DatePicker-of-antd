import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
// import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import strip from "@rollup/plugin-strip";

import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    nodeResolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    // babel({
    //   exclude: "node_modules/**"
    // }),
    commonjs(),
    // strip({
    //   include: "**/*.(ts|tsx)"
    // })
  ]
};
