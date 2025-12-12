/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                light: {
                    primary: "#14C2ED",
                    secondary: "#0EA5E9",
                    accent: "#34D399",
                    neutral: "#2A2E37",
                    "base-100": "#FFFFFF",
                    "base-200": "#F2F7FA",
                    "base-300": "#E3EDF1",
                    info: "#38BDF8",
                    success: "#22C55E",
                    warning: "#FACC15",
                    error: "#EF4444",
                },
            },
            {
                dark: {
                    primary: "#14C2ED",
                    secondary: "#0C8DB8",
                    accent: "#2DD4BF",
                    neutral: "#1B1D22",
                    "base-100": "#0D0F12",
                    "base-200": "#13161B",
                    "base-300": "#1C1F25",
                    info: "#0EA5E9",
                    success: "#16A34A",
                    warning: "#F59E0B",
                    error: "#DC2626",
                },
            },
        ],
    },
};
