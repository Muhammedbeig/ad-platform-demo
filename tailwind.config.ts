import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    // These paths scan your 'app' and 'components' folders for styles
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;