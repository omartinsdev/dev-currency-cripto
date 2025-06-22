import { RouterProvider } from "react-router";

import { appRouter } from "./router";

import "./App.css";

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
