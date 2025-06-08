import { RouterProvider } from "react-router";
import { router } from "./routes/browser.router";
import { ThemeProvider } from "./components/ui/theme/theme-provider";
import { Toaster } from "react-hot-toast";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
