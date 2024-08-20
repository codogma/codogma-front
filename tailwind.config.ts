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
                'astral': '#39728E'
            }
        },
    },
    plugins: [],
};
export default config;