/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FFB22C',
                accent: '#D06224',
                dark: '#244837',
            },
        },
    },
    plugins: [],
}
