import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import HomeForm from './HomeForm';
import LinearProgress from '@mui/material/LinearProgress';
import HomeForm2 from './HomeForm2'; // Import HomeForm2
import Tooltip from '@mui/material/Tooltip'; // Ensure Tooltip is imported

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editTodo, setEditTodo] = useState(null);
  const [showHomeForm2, setShowHomeForm2] = useState(false);

  const handleEditButtonClick = (todo) => {
    setEditTodo(todo);
    setShowHomeForm2(true);
    setShowForm(false);
  };

  const handleButtonClick = () => {
    setEditTodo(null);
    setShowForm(true);
    setShowHomeForm2(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setShowHomeForm2(false);
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

  return (
    <div className='justify-center sm:justify-start p-5 min-h-screen'>

      {/* Add Todo button */}
      {!showForm && !showHomeForm2 && (
        <div className='flex md:justify-start justify-center items-center'>
          <div
            className='w-60 h-60 sm:w-80 sm:h-80 rounded-lg cursor-pointer text-6xl flex justify-center items-center border border-neutral-500 group transition-all duration-300 hover:border-blue-500 active:scale-95 active:shadow-inner active:shadow-blue-500 active:border-blue-500'
            onClick={handleButtonClick}
          >
            <IoIosAddCircleOutline className='text-neutral-500 group-hover:text-blue-500 transition-colors duration-300' />
          </div>
        </div>
      )}

      {/* Show Home Title Only When Todos Are Visible */}
      {!showForm && !showHomeForm2 && todos.length > 0 && (
        <div className='flex mt-8 justify-center'>
          <div className='bg-neutral-700 w-32 sm:h-14 rounded-md shadow-lg shadow-neutral-500 text-white content-center text-3xl font-bold text-center font-sans'>
            Home
          </div>
        </div>
      )}

      {/* Show Forms */}
      {showForm && <HomeForm onClose={handleFormClose} editTodo={editTodo} />}
      {showHomeForm2 && <HomeForm2 onClose={() => setShowHomeForm2(false)} editTodo={editTodo} />}

      {/* Loading or Error State */}
      {loading ? (
        <div className="w-full px-10 sm:px-20 md:px-40 py-10">
          <LinearProgress />
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          {/* Show Todos */}
          {!showForm && !showHomeForm2 && todos.length > 0 ? (
            <ul className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6'>
              {todos.map((todo) => (
                <li key={todo._id} className="flex flex-col pt-4 pl-4 pb-3 rounded-lg mt-10 mx-10 shadow-neutral-700 shadow-xl"
                  style={{ backgroundColor: todo.backgroundColor || '#f0f0f0' }}
                >
                  <div className="text-lg w-40 text-white mb-auto flex-grow">
                    <div className='font-bold text-2xl'>{todo.title}</div>
                    <div className='font-medium text-xl'>{todo.description}</div>
                  </div>

                  <div className="flex space-x-3 mt-8">
                    <div className='mt-7 space-x-3'>
                      {/* Edit and Delete Buttons */}
                      <Tooltip title="Edit" arrow placement="top">
                        <button onClick={() => handleEditButtonClick(todo)} className="text-blue-500 hover:text-blue-700 transition rounded-lg h-10 w-9 hover:bg-white border-blue-600 px-1 border focus:outline-none">
                          <MdEdit size={24} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete" arrow placement="top">
                        <button onClick={() => handleDelete(todo._id)} className="text-red-500 hover:text-red-700 transition rounded-md border h-10 w-9 px-1 border-red-500 hover:bg-red-100 focus:outline-none">
                          <MdDelete size={24} />
                        </button>
                      </Tooltip>
                    </div>
                    <div className='pt-5 text-xl font-semibold text-white font-sans'>
                      <div className=''>{new Date(todo.date).toLocaleDateString('en-GB')}</div>
                      <div className=''>{todo.list}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !showForm && !showHomeForm2 && <div><h1 className='text-center font-bold text-2xl'>No todos found. Add one to get started!</h1></div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
