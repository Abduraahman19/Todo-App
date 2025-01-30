import React, { useEffect, useState } from "react";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { MdDelete, MdEdit } from "react-icons/md"; // Delete aur Edit icons ke liye
import HomeForm from './HomeForm'; // Form ko reuse karna jab edit karen

function UpComing() {
  const [todos, setTodos] = useState([]);  // Todos ki list store karna
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [showForm, setShowForm] = useState(false);  // Form ko show karne ke liye
  const [editTodo, setEditTodo] = useState(null);  // Edit karte waqt selected todo

  useEffect(() => {
    fetchTodos();  // Todos ko fetch karna component ke mount hone par
  }, []);

  // Fetch karna todos ko backend se
  const fetchTodos = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");  // Token ko localStorage se lene ka tariqa

    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Aaj ke baad wale todos ko filter karna
      const today = new Date().setHours(0, 0, 0, 0);
      const upcomingTodos = (response.data.todos || []).filter((todo) => {
        const todoDate = new Date(todo.date).setHours(0, 0, 0, 0);
        return todoDate > today;  // Aaj ke baad wale todos
      });

      setTodos(upcomingTodos);  // Todos ko update karna
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Error fetching todos");  // Error handle karna
    } finally {
      setLoading(false);  // Loading ko false karna
    }
  };

  // Edit karne ke liye function
  const handleEdit = (todo) => {
    setEditTodo(todo);  // Edit hone wale todo ko set karna
    setShowForm(true);  // Form ko show karna jab edit karen
  };

  // Todo ko delete karne ka function
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

    // Axios se delete request bhejna
    axios.delete(`http://localhost:5000/api/todo/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));  // Todo ko list se hata dena
        console.log(`Todo with ID ${id} deleted successfully.`);
      })
      .catch(err => {
        console.error('Error deleting todo:', err);
        setError('Error deleting todo');  // Error handle karna
      });
  };

  // Form ko close karne ka function
  const handleFormClose = () => {
    setShowForm(false);  // Form ko band kar dena
  };

  return (
    <div className="p-5 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-5">Upcoming Todos</h2>

      {loading ? (
        <div className="w-full px-10 sm:px-20 md:px-40 py-10">
          <LinearProgress />  {/* Loading indicator */}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>  
      ) : todos.length > 0 ? (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="p-4 rounded-lg border border-gray-300 shadow"
              style={{ backgroundColor: todo.backgroundColor || "#f0f0f0" }}
            >
              <div className="text-lg text-white">
                <div>
                  <strong>Title:</strong> {todo.title}
                </div>
                <div>
                  <strong>Description:</strong> {todo.description}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(todo.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>List:</strong> {todo.list}
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleEdit(todo)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <MdEdit size={24} />
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <MdDelete size={24} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No upcoming todos found.</p>
      )}

      {showForm && <HomeForm onClose={handleFormClose} editTodo={editTodo} />}  {/* Edit form ko show karna */}
    </div>
  );
}

export default UpComing;
