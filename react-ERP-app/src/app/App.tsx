import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../shared/api/query-client";
import { RouterProvider } from "react-router";
import { router } from "../routes/browser-router";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
