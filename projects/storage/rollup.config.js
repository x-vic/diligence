import { nodeResolve } from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'

export default {
  input: 'src/index.ts',
  output: {
    file: path.resolve(__dirname, 'lib/index.js'),
    // global: 弄个全局变量来接收
    // cjs: module.exports
    // esm: export default
    // iife: ()()
    // umd: 兼容 amd + commonjs 不支持es6导入
    format: 'esm',
    sourcemap: true, // ts中的sourcemap也得变为true
  },
  plugins: [
    // 这个插件是有执行顺序的
    nodeResolve({
      extensions: ['.js', '.ts'],
    }),
    commonjs({ sourceMap: true }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    }),
  ],
}
