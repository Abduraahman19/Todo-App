import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import axios from "axios";
import { MdEdit, MdDelete } from "react-icons/md";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import HomeForm2 from "./HomeForm2";

export default function DateTimeWithLiveClock() {
  const [date, setDate] = React.useState(dayjs());
  const [time, setTime] = React.useState(dayjs().format("HH:mm:ss"));
  const [todos, setTodos] = React.useState([]);
  const [filteredTodos, setFilteredTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [activeForm, setActiveForm] = React.useState(null);
  const [editTodo, setEditTodo] = React.useState(null);

  React.useEffect(() => {
    fetchTodos();
  }, []);

  React.useEffect(() => {
    filterTodosForDate(date);
  }, [date, todos]);

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodos(response.data.todos || []);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Error fetching todos");
    } finally {
      setLoading(false);
    }
  };

  const filterTodosForDate = (selectedDate) => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const filtered = todos.filter(
      (todo) => dayjs(todo.date).format("YYYY-MM-DD") === formattedDate
    );
    setFilteredTodos(filtered);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Todo ID is undefined");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/todo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Error deleting todo");
    }
  };

  const handleEditButtonClick = (todo) => {
    setEditTodo(todo);
    setActiveForm("HomeForm2");
  };

  const handleFormClose = () => {
    setActiveForm(null);
    setEditTodo(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col items-center w-full p-6">
        {activeForm === "HomeForm2" ? (
          <HomeForm2 onClose={handleFormClose} editTodo={editTodo} />
        ) : (
          <>
            <div className="w-full max-w-sm text-center bg-neutral-700 text-white rounded-xl p-4 shadow-md mb-6">
              <h2 className="text-2xl font-semibold underline underline-offset-8 mb-5">Date & Time</h2>
              <p className="text-xl font-bold">{date.format("DD MMM YYYY")}</p>
              <p className="text-2xl font-mono font-semibold mt-2">{time}</p>
            </div>

            <div className="w-full max-w-sm text-center text-white rounded-xl p-4 mb-6">
              <div className="w-full max-w-md text-center bg-neutral-700 text-white rounded-xl mb-[-20px] p-4">
                <DateCalendar
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  sx={{
                    color: "white",
                    "& .MuiTypography-root": { color: "white" },
                    "& .MuiPickersDay-root": { color: "white" }, 
                    "& .Mui-selected": { backgroundColor: "white", color: "black" },
                    "& .MuiButtonBase-root": { color: "white" }, 
                    "& .MuiSvgIcon-root": { color: "white" },
                    "& .MuiInputBase-root": { color: "white" },
                    "& .MuiOutlinedInput-root": { borderColor: "white" }, 
                    "& .MuiFormLabel-root": { color: "white" }, 
                  }}
                />
              </div>
            </div>

            <div className="w-full p-4 rounded-xl">
              <h2 className="text-2xl font-semibold text-center">
                Todos for {date.format("DD MMM YYYY")}
              </h2>

              {loading ? (
                <LinearProgress />
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : filteredTodos.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
                  {filteredTodos.map((todo) => (
                    <li
                      key={todo._id}
                      className="flex flex-col pt-4 pl-4 pb-3 rounded-lg mt-10 mx-10 shadow-neutral-700 shadow-xl"
                      style={{ backgroundColor: todo.backgroundColor || "#f0f0f0" }}
                    >
                      <div className="text-lg w-40 text-white mb-auto flex-grow">
                        <div className="text-2xl font-bold">{todo.title}</div>
                        <div className="text-xl font-medium">{todo.description}</div>
                      </div>

                      <div className="flex space-x-3 mt-8">
                        <div className="mt-7 space-x-3">
                          <Tooltip title="Edit" arrow placement="top">
                            <button
                              onClick={() => handleEditButtonClick(todo)}
                              className="text-blue-500 hover:text-blue-700 transition rounded-lg h-10 w-9 hover:bg-white border-blue-600 px-1 border focus:outline-none"
                            >
                              <MdEdit size={24} />
                            </button>
                          </Tooltip>

                          <Tooltip title="Delete" arrow placement="top">
                            <button
                              onClick={() => handleDelete(todo._id)}
                              className="text-red-500 hover:text-red-700 transition rounded-md border h-10 w-9 px-1 border-red-500 hover:bg-red-100 focus:outline-none"
                            >
                              <MdDelete size={24} />
                            </button>
                          </Tooltip>
                        </div>
                        <div className="pt-5 text-xl font-semibold text-white font-sans">
                          <div className="">{new Date(todo.date).toLocaleDateString()}</div>
                          <div className="">{todo.list}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No todos for this date.</p>
              )}
            </div>
          </>
        )}
      </div>
    </LocalizationProvider>
  );
}