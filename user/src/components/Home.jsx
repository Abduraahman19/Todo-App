import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import HomeForm from './HomeForm';
import LinearProgress from '@mui/material/LinearProgress';
import HomeForm2 from './HomeForm2'; // Import HomeForm2

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editTodo, setEditTodo] = useState(null);
  const [showHomeForm2, setShowHomeForm2] = useState(false);

  const handleEditButtonClick = () => {
    setShowHomeForm2(true); // Show HomeForm2 when clicked
    setShowForm(false); // Hide HomeForm when Edit is clicked
  };

  const handleButtonClick = () => {
    setEditTodo(null);
    setShowForm(true);
    setShowHomeForm2(false); // Close HomeForm2 if open
  };

  const handleFormClose = () => {
    setShowForm(false);
    setShowHomeForm2(false); // Ensure HomeForm2 is closed
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      setError('No token found');
      return;
    }

    axios.get('http://localhost:5000/api/todos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setTodos(Array.isArray(response.data.todos) ? response.data.todos : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching todos:', err);
      });
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
      headers: { Authorization: `Bearer ${token}` }
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
    setShowForm(true);
    setShowHomeForm2(false); // Close HomeForm2 if open
  };

  return (
    <div className='justify-center sm:justify-start p-5 min-h-screen'>
      {loading ? (
        <div className="w-full px-10 sm:px-20 md:px-40 py-10">
          <LinearProgress />
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          {!showForm && !showHomeForm2 && todos.length > 0 ? (
            <ul>
              {todos.map((todo) => (
                <li key={todo._id} className="mb-4 rounded-lg p-4 border-b flex justify-between items-center"
                  style={{ backgroundColor: todo.backgroundColor || '#f0f0f0' }}
                >
                  <div className='text-lg text-white'>
                    <div><strong>Title:</strong> {todo.title}</div>
                    <div><strong>Description:</strong> {todo.description}</div>
                    <div><strong>Date:</strong> {new Date(todo.date).toLocaleDateString()}</div>
                    <div><strong>List:</strong> {todo.list}</div>
                  </div>

                  <div className="flex space-x-3">
                    <button onClick={handleEditButtonClick} className="text-blue-500 hover:text-blue-700 transition">
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
            !showForm && !showHomeForm2 && <div><h1 className='text-center font-bold text-2xl'>No todos found. Add one to get started!</h1></div>
          )}
        </div>
      )}

      {!showForm && !showHomeForm2 && (
        <div
          className='w-80 h-80 rounded-lg cursor-pointer text-6xl flex justify-center items-center border border-neutral-500 group transition-all duration-300 hover:border-blue-500 active:scale-95 active:shadow-inner active:shadow-blue-500 active:border-blue-500 mt-5'
          onClick={handleButtonClick}
        >
          <IoIosAddCircleOutline className='text-neutral-500 group-hover:text-blue-500 transition-colors duration-300' />
        </div>
      )}

      {showForm && <HomeForm onClose={handleFormClose} editTodo={editTodo} />}
      {showHomeForm2 && <HomeForm2 onClose={() => setShowHomeForm2(false)} />}
    </div>
  );
}

export default Home;
