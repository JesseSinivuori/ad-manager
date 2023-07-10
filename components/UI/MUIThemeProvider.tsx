"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const violet600 = createTheme({
  palette: {
    primary: {
      main: "#7c3aed",
    },
  },
});

export default function MUIThemeProvider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: "violet600";
}) {
  return (
    <ThemeProvider theme={theme === "violet600" ? violet600 : violet600}>
      {children}
    </ThemeProvider>
  );
}
