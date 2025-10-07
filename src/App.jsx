import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LeaveRequests from "./pages/LeaveRequest";
import CalendarView from "./pages/CalendarView";

const progressRouter = createBrowserRouter([
  {path: "/", element: <Home /> },
  {path: "/login", element: <Login />},
  {path: "/register", element: <Register />},
  {path: "/leaves", element: <LeaveRequests />},
  {path: "/calendar", element: <CalendarView />},
]);

export default function App() {
  return <RouterProvider router={progressRouter} />;
}
