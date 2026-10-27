import { createTheme } from "@mui/material";
import { Assistant } from "next/font/google";
const assistantFont = Assistant({
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});

const defaultShadows = createTheme().shadows;

const lightShadows = [...defaultShadows] as typeof defaultShadows;
lightShadows[0] = "none";
lightShadows[1] =
  "0px 2px 1px -1px rgba(0,0,0,0.15), 0px 1px 1px 0px rgba(0,0,0,0.15), 0px 1px 3px 0px rgba(0,0,0,0.15)";
lightShadows[2] = "none";
lightShadows[8] = "0 5px 5px rgba(0,0,0,0.15)";

const darkShadows = [...defaultShadows] as typeof defaultShadows;
darkShadows[0] = "none";
darkShadows[1] =
  "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)";
darkShadows[2] = "none";
darkShadows[8] = "0 5px 5px rgba(0,0,0,0.15)";

export const lightTheme = createTheme({
  colorSchemes: {
    light: true,
  },
  palette: {
    mode: "light",
    common: {
      black: "#030712",
      white: "#fff",
    },
    primary: {
      main: "rgb(7, 158, 204)",
    },
    secondary: {
      main: "rgb(8, 161, 207)",
      light: "#f8fafc",
    },
    background: {
      paper: "#ffffff",
      default: "#ffffff",
    },
    text: {
      primary: "#030712",
      secondary: "#6B7280",
    },
    success: {
      main: "#22c55e",
      light: "#4caf50",
      dark: "#1b5e20",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: assistantFont.style.fontFamily,
  },
  shadows: lightShadows,
} as any) ;



export const darkTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    mode: "dark",
    common: {
      black: "#030712",
      white: "#fff",
    },
    primary: {
      main: "rgb(7, 158, 204)",
    },
    background: {
      paper: "#0b0a10",
      default: "#0b0a10",
    },
    text: {
      primary: "#d4d4d4",
      secondary: "#9ca3af",
    },
    action: {
      active: "#9ca3af",
    },
  },
  typography: {
    fontFamily: assistantFont.style.fontFamily,
  },
  shadows: darkShadows,
});