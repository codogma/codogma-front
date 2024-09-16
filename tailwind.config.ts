import type {Config} from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'seashell': '#F0F0F0',
                'bunker': '#171717',
                'cod-gray': '#080808',
                'mine-shaft': '#333',
                'alto': '#ddd',
                'mountain-mist': '#909090',
                'rolling-stone': '#6F7577',
                'shady-lady': '#aaa',
                'horizon': '#548EAA',
                'deepsky-blue': '#4cb7eb',
                'astral': '#39728E',
                'curious-blue': '#3193c4',
                'solitude': '#E7F3FF',
                'elephant': '#1a334d',
                'shark': '#1F2225',
                'limed-spruce': '#303B44',
                'limed-spruce-rgba': 'rgba(48,59,68,0.8)',
                'woodsmoke': '#0d0d0d',
                'woodsmoke-rgba': 'rgba(13,13,13,0.80)',
                'loblolly': '#BBCDD6',
                'cerulean': '#49ADDF'
            }
        },
    },
    plugins: [],
};
export default config;