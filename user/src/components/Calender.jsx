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
import Swal from "sweetalert2";

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

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    if (!id) {
      console.error('Todo ID is undefined');
      return;
    }

    Swal.fire({
      background: '#64748B',
      color: 'white',
      title: 'Are you sure?',
      text: 'You will not be able to recover this todo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#655CC9',
      customClass: {
        popup: 'swal-rounded-popup',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/api/todo/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(() => {
            setTodos(todos.filter(todo => todo._id !== id));
            console.log(`Todo with ID ${id} deleted successfully.`);
          })
          .catch(err => {
            console.error('Error deleting todo:', err);
            setError('Error deleting todo');
          });
      }
    });

    const style = document.createElement('style');
    style.innerHTML = `
      .swal-rounded-popup {
        border-radius: 20px !important;
      }
    `;
    document.head.appendChild(style);
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
            <div className="flex justify-center">
              <div className="w-full max-w-sm text-center rounded-xl  p-4 mb-6">
                <div className="w-full max-w-md text-center bg-[#90CAF9] bg-opacity-20 rounded-xl mb-[-20px] p-4">
                  <DateCalendar
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                  />
                </div>
              </div>
              <div className="w-full max-w-sm h-40 mt-4 text-center bg-[#90CAF9] bg-opacity-20 rounded-xl p-4 shadow-md mb-6">
                <h2 className="text-2xl font-semibold underline underline-offset-8 mb-5">Date & Time</h2>
                <p className="text-xl font-bold">{date.format("DD MMM YYYY")}</p>
                <p className="text-2xl font-mono font-semibold mt-2">{time}</p>
              </div>
            </div>
            <div className="w-full p-4 rounded-xl">
              <h2 className="text-2xl font-semibold text-center">
                Todos for {date.format("DD MMM YYYY")}
              </h2>

              {loading ? (
                <div className="w-full px-10 sm:px-20 md:px-40 py-10">
                  <LinearProgress />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : filteredTodos.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTodos.map((todo) => (
                    <li
                      key={todo._id}
                      className="flex flex-col p-5 rounded-lg shadow-lg mt-10 bg-opacity-90 backdrop-blur-md"
                      style={{ backgroundColor: todo.backgroundColor || "#f0f0f0" }}
                    >
                      <div className="text-lg text-white mb-auto flex-grow">
                        <div className="text-2xl font-bold">{todo.title}</div>
                        <div className="text-xl font-medium">{todo.description}</div>
                      </div>

                      <div className="flex justify-between items-center mt-8">
                        <div>
                          <div className="text-lg font-semibold text-white">{new Date(todo.date).toLocaleDateString()}</div>
                          <div className="text-md text-gray-300">{todo.list}</div>
                        </div>
                        <div className="flex space-x-3">
                          <Tooltip title="Edit" arrow placement="top">
                            <button
                              onClick={() => handleEditButtonClick(todo)}
                              className="text-blue-500 hover:text-blue-700 transition rounded-lg p-2 border border-blue-600 hover:bg-white">
                              <MdEdit size={24} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete" arrow placement="top">
                            <button
                              onClick={() => handleDelete(todo._id)}
                              className="text-red-500 hover:text-red-700 transition rounded-lg p-2 border border-red-500 hover:bg-red-100">
                              <MdDelete size={24} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center mt-5">No todos for this date.</p>
              )}
            </div>
          </>
        )}
      </div>
    </LocalizationProvider>
  );
}