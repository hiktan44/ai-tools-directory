/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066FF',
          light: '#3385ff',
          dark: '#0047b3',
        },
        background: {
          light: '#ffffff',
          dark: '#121212',
        },
        text: {
          light: '#171717',
          dark: '#f3f4f6',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.8s ease-out forwards',
        'slideInLeft': 'slideInLeft 0.5s ease-out forwards',
        'slideInRight': 'slideInRight 0.5s ease-out forwards',
        'scaleIn': 'scaleIn 0.5s ease-out forwards',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 102, 255, 0.5)',
        'glow-lg': '0 0 25px rgba(0, 102, 255, 0.5)',
        'glow-xl': '0 10px 25px -5px rgba(0, 102, 255, 0.4), 0 8px 10px -6px rgba(0, 102, 255, 0.2)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-diagonal': 'linear-gradient(to right bottom, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 