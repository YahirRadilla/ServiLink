/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primarybg-servilink": "#161622",
        "links-servilink": "#3D5DC7",
        "auth-border-servilink": "#8c9cad",
        "primary-servilink": "#515def",
        neutral300: "#eff0f6",
        neutral400: "#d9dbe9",
        neutral500: "#a0a3bd",
        neutral600: "#6f6c8f",
        neutral700: "#514f6e",
        neutral800: "#170f49",
        "error-servilink:": "#f75555",
        "active-status-servilink": "#3FBF73",
        "finished-status-servilink": "#8B3838",
        "pending-status-servilink": "#C5A34C",
      },
    },
  },
  plugins: [],
};
