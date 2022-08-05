import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

export default {
  output: {
    dir: 'release',
    format: 'cjs'
  },
  plugins: [
	nodeResolve(),
	commonjs(),
	babel({ babelHelpers: 'bundled' }),
	json()
  ]
};