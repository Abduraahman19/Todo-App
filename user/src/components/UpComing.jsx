import React, { useEffect, useState } from "react";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { MdDelete, MdEdit } from "react-icons/md";
import HomeForm from "./HomeForm";
import HomeForm2 from "./HomeForm2";
import Tooltip from '@mui/material/Tooltip';

function UpComing() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const today = new Date().setHours(0, 0, 0, 0);
      const upcomingTodos = (response.data.todos || []).filter((todo) => {
        const todoDate = new Date(todo.date).setHours(0, 0, 0, 0);
        return todoDate > today;
      });

      setTodos(upcomingTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Error fetching todos");
    } finally {
      setLoading(false);
    }
  };

  const handleEditButtonClick = (todo) => {
    setEditTodo(todo);
    setActiveForm("HomeForm2");
  };

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

  const handleFormClose = () => {
    setActiveForm(null);
    setEditTodo(null);
  };

  return (
    <div className="p-5">
      <div className="flex justify-center">
        <h2 className="text-3xl font-bold text-center shadow-neutral-700 shadow-xl bg-[#737373] p-4 rounded">
          Upcoming Todos
        </h2>
      </div>

      {loading ? (
        <div className="w-full px-10 sm:px-20 md:px-40 py-10">
          <LinearProgress />
        </div>
      ) : error ? (
        <div className="text-red-600 font-semibold text-center">{error}</div>
      ) : (
        <>
          {!activeForm && todos.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="flex flex-col pt-4 pl-4 pb-3 rounded-lg mt-10 mx-10 shadow-neutral-700 shadow-xl"
                  style={{ backgroundColor: todo.backgroundColor || "#f0f0f0" }}
                >
                  <div className="text-lg w-40 text-white mb-auto flex-grow">
                    <div className="font-bold text-2xl">{todo.title}</div>
                    <div className="font-medium text-xl">{todo.description}</div>
                  </div>
                  <div className="flex space-x-3 mt-8">
                    <div className="mt-7 space-x-3">
                      <Tooltip title="Edit" arrow placement="top">
                        <button
                          onClick={() => handleEditButtonClick(todo)}
                          className="text-blue-500 hover:text-blue-700 transition rounded-lg h-10 w-9 hover:bg-white border-blue-600 px-1 border focus:outline-none">
                          <MdEdit size={24} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete" arrow placement="top">
                        <button
                          onClick={() => handleDelete(todo._id)}
                          className="text-red-500 hover:text-red-700 transition rounded-md border h-10 w-9 px-1 border-red-500 hover:bg-red-100 focus:outline-none">
                          <MdDelete size={24} />
                        </button>
                      </Tooltip>
                    </div>
                    <div className="pt-5 text-xl font-semibold text-white font-sans">
                      <div>{new Date(todo.date).toLocaleDateString()}</div>
                      <div>{todo.list}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !activeForm && <h1 className="mt-10 text-center">No upcoming todos found.</h1>
          )}
        </>
      )}

      {activeForm === "HomeForm" && <HomeForm onClose={handleFormClose} editTodo={editTodo} />}
      {activeForm === "HomeForm2" && <HomeForm2 onClose={handleFormClose} editTodo={editTodo} />}
    </div>
  );
}

export default UpComing;
