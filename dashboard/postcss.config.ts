import type { Plugin } from 'postcss';

const config = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ] as Plugin[],
};

export default config;


