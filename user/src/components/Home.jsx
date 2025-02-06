import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import HomeForm from './HomeForm';
import LinearProgress from '@mui/material/LinearProgress';
import HomeForm2 from './HomeForm2';
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2';

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

  return (
    <div className='justify-center sm:justify-start p-5'>
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

      {!showForm && !showHomeForm2 && todos.length > 0 && (
        <div className='flex mt-8 justify-center'>
          <div className='bg-[#90CAF9] bg-opacity-20 px-5 sm:h-14 rounded-md shadow-md content-center text-3xl font-bold text-center font-sans'>
            Home
          </div>
        </div>
      )}

      {showForm && <HomeForm onClose={handleFormClose} editTodo={editTodo} />}
      {showHomeForm2 && <HomeForm2 onClose={() => setShowHomeForm2(false)} editTodo={editTodo} />}

      {loading ? (
        <div className="w-full px-10 sm:px-20 md:px-40 py-10">
          <LinearProgress />
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          {!showForm && !showHomeForm2 && todos.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {todos.map((todo, index) => (
                <li key={todo._id} className="flex flex-col p-5 rounded-lg shadow-lg mt-10 bg-opacity-90 backdrop-blur-md relative"
                  style={{ backgroundColor: todo.backgroundColor || '#f0f0f0' }}
                >
                  <div className="text-lg text-white mb-auto">
                    <div className='font-bold text-2xl'>{todo.title}</div>
                    <div className='font-medium text-xl'>{todo.description}</div>
                  </div>

                  <div className="flex justify-between items-center mt-8">
                    <div>
                      <div className="text-lg font-semibold text-white">{new Date(todo.date).toLocaleDateString()}</div>
                      <div className="text-md text-gray-300">{todo.list}</div>
                    </div>
                    <div className="flex space-x-3">
                      <Tooltip title="Edit" arrow placement="top">
                        <button
                          onClick={() => handleEditButtonClick(todo, "HomeForm2")}
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
            !showForm && !showHomeForm2 && (
              <div className="flex justify-center">
                <div className="text-3xl font-bold text-center text-gray-500 mt-10">
                  No todos found.
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
