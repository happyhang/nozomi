import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

module.exports = {
  input: 'index.js',
  output: {
    file: 'dist/nozomi.js',
    format: 'cjs'
  },
  watch: {
    clearScreen: true,
  },
  plugins: [ resolve({ preferBuiltins: true }), commonjs() ],
};
