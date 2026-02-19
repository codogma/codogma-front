import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        red: '#FF0000',
        seashell: '#F0F0F0',
        bunker: '#171717',
        'cod-gray': '#080808',
        'mine-shaft': '#333',
        alto: '#ddd',
        'mountain-mist': '#909090',
        'rolling-stone': '#6F7577',
        'shady-lady': '#aaa',
        horizon: '#548EAA',
        'deepsky-blue': '#4cb7eb',
        astral: '#39728E',
        'curious-blue': '#3193c4',
        solitude: '#E7F3FF',
        elephant: '#1a334d',
        shark: '#1F2225',
        'limed-spruce': '#303B44',
        'limed-spruce-rgba': 'rgba(48,59,68,0.8)',
        woodsmoke: '#0d0d0d',
        'woodsmoke-rgba': 'rgba(13,13,13,0.8)',
        loblolly: '#BBCDD6',
        cerulean: '#49ADDF',
        'vida-loca': '#548221',
        'black-alpha-10': 'rgba(0, 0, 0, 0.1)',
      },
      screens: {
        xs: '0px',
        sm: '600px',
        md: '900px',
        lg: '1200px',
        xl: '1536px',
      },
      animation: {
        'color-pulse': 'color-pulse 1s cubic-bezier(0.4, 0, 0.6, 1) 3',
        'box-shadow-pulse': 'box-shadow-pulse 1s ease infinite',
      },
      keyframes: {
        'color-pulse': {
          '50%': {
            color: 'lime',
            opacity: '0.5',
          },
        },
        'box-shadow-pulse': {
          '0%': {
            boxShadow: '0 0 0 0 currentColor',
          },
          '50%': {
            boxShadow: '0 0 0 7px transparent',
          },
          '100%': {
            boxShadow: '0 0 0 0 transparent',
          },
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', "'Fira Code'", 'monospace'],
      },
      spacing: {
        4.5: '1.125rem',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
      },
      lineHeight: {
        18: '4.5rem',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
    },
  },
  plugins: [],
};
export default config;
