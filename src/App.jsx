import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LeaveRequests from "./pages/LeaveRequest";

const progressRouter = createBrowserRouter([
  {path: "/", element: <Home /> },
  {path: "/login", element: <Login />},
  {path: "/register", element: <Register />},
  {path: "/leaves", element: <LeaveRequests />},
]);

export default function App() {
  return <RouterProvider router={progressRouter} />;
}
