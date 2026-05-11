import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US"; 
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "../components/Navbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchLeaves();
  }, []);

  async function fetchLeaves() {
    try {
      const url = isAdmin 
        ? "https://69fb38d588a7af0ecca8c3e7.mockapi.io/leaves"
        : `https://69fb38d588a7af0ecca8c3e7.mockapi.io/leaves?userId=${userId}`;
      
      const res = await axios.get(url, {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });

      const leavesArray = Array.isArray(res.data) ? res.data : [];
      
      const formatted = leavesArray.map((leave) => ({
        title: `${leave.reason || "Leave"} (${leave.status})`,
        start: new Date(leave.startDate),
        end: new Date(leave.endDate),
        allDay: true,
        status: leave.status,
      }));

      setEvents(formatted);
    } catch (err) {
      console.error("Error loading calendar data:", err);
    }
  }

  const eventStyleGetter = (event) => {
    let bgColor =
      event.status === "approved"
        ? "#16a34a"
        : event.status === "rejected"
        ? "#dc2626"
        : "#facc15";

    return {
      style: {
        backgroundColor: bgColor,
        borderRadius: "8px",
        color: "white",
        border: "none",
        display: "block",
        padding: "4px",
      },
    };
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-300 to-blue-500 p-6 mt-16">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">
              Leave Calendar
            </h2>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              {isAdmin ? "User View" : "Admin View"}
            </button>
          </div>
          <div className="h-[80vh]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              popup
            />
          </div>
        </div>
      </div>
    </>
  );
}