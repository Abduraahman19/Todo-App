import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import { MdDelete, MdEdit } from "react-icons/md"; // Add icons for Edit and Delete
import HomeForm from './HomeForm'; // Import the HomeForm for editing

function TodayTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editTodo, setEditTodo] = useState(null); // State for the todo being edited
  const [showForm, setShowForm] = useState(false); // State for toggling form visibility

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const today = new Date().toLocaleDateString(); // Get today's date in the same format

      // Filter todos that are for today
      const todaysTodos = response.data.todos.filter(todo => {
        return new Date(todo.date).toLocaleDateString() === today;
      });

      setTodos(todaysTodos); // Set only today's todos
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Error fetching todos');
    } finally {
      setLoading(false);
    }
  };

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
  };

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setShowForm(true); // Show form for editing
  };

  return (
    <div className="p-5 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-5">Today's Todos</h2>

      {loading ? (
        <div className="w-full px-10 sm:px-20 md:px-40 py-10">
          <LinearProgress />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : todos.length > 0 ? (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="p-4 rounded-lg border border-gray-300 shadow"
              style={{ backgroundColor: todo.backgroundColor || '#f0f0f0' }} // Background color applied
            >
              <div className="text-lg text-white">
                <div><strong>Title:</strong> {todo.title}</div>
                <div><strong>Description:</strong> {todo.description}</div>
                <div><strong>Date:</strong> {new Date(todo.date).toLocaleDateString()}</div>
                <div><strong>List:</strong> {todo.list}</div>
              </div>

              <div className="flex space-x-3 mt-3">
                <button onClick={() => handleEdit(todo)} className="text-blue-500 hover:text-blue-700 transition">
                  <MdEdit size={24} />
                </button>
                <button onClick={() => handleDelete(todo._id)} className="text-red-500 hover:text-red-700 transition">
                  <MdDelete size={24} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No todos for today.</p>
      )}

      {showForm && <HomeForm onClose={() => setShowForm(false)} editTodo={editTodo} />}
    </div>
  );
}

export default TodayTodos;
