import React, { useEffect, useState } from "react";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { MdDelete, MdEdit } from "react-icons/md";
import HomeForm from "./HomeForm";
import HomeForm2 from "./HomeForm2";
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2';

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
    }).then(async (result) => {
      if (result.isConfirmed) {
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

  const handleFormClose = () => {
    setActiveForm(null);
    setEditTodo(null);
  };

  return (
    <div className="p-5">
      {!activeForm && (
        <div className="flex justify-center">
          <h2 className="text-3xl font-bold text-center shadow-md bg-[#90CAF9] bg-opacity-20 p-4 rounded-md">
            Upcoming Todos
          </h2>
        </div>
      )}

      {loading ? (
        <div className="w-full px-10 sm:px-20 md:px-40 py-10">
          <LinearProgress />
        </div>
      ) : error ? (
        <div className="text-red-600 font-semibold text-center">{error}</div>
      ) : (
        <>
          {!activeForm && todos.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="flex flex-col p-5 rounded-lg shadow-lg mt-10 bg-opacity-90 backdrop-blur-md"
                  style={{ backgroundColor: todo.backgroundColor || "#f0f0f0" }}
                >
                  <div className="text-lg text-white mb-auto">
                    <div className="font-bold text-2xl">{todo.title}</div>
                    <div className="font-medium text-xl">{todo.description}</div>
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
