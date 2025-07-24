import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./routes/home";
import Detect from "./routes/detect";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/detect/:id?",
      element: <Detect />,
    },
  ],
  {
    basename: "/",
  }
);

startTransition(() => {
  hydrateRoot(
    document.getElementById("root")!,
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
});