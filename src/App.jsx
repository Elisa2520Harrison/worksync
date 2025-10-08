import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CalendarView from "./pages/CalendarView";
import UserLeaveRequests from "./pages/UserLeaveRequest";
import AdminLeaveRequests from "./pages/AdminRequests";

const progressRouter = createBrowserRouter([
  {path: "/", element: <Home /> },
  {path: "/login", element: <Login />},
  {path: "/register", element: <Register />},
  {path: "/leaves", element: <UserLeaveRequests />},
  {path: "/calendar", element: <CalendarView />},
  {path: "/admin", element: <AdminLeaveRequests />},
]);

export default function App() {
  return <RouterProvider router={progressRouter} />;
}
