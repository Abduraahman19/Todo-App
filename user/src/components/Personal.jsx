import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import { MdDelete, MdEdit } from "react-icons/md";
import HomeForm2 from './HomeForm2';
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2';

function Personal() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editTodo, setEditTodo] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

      setTodos(response.data.todos);
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
  const handleEdit = (todo) => {
    setEditTodo(todo);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditTodo(null);
  };

  const filteredTodos = todos.filter(todo => todo.list === "Personal");

  return (
    <div className="p-5">
      {!showForm && todos.length > 0 && (
        <div className="flex justify-center">
          <h2 className="text-3xl font-bold text-center shadow-md bg-[#90CAF9] bg-opacity-20 p-4 rounded-md">
            Personal Todos
          </h2>
        </div>
      )}
      {showForm && <HomeForm2 onClose={handleFormClose} editTodo={editTodo} />}

      {!showForm && (
        <>
          {loading ? (
            <div className="w-full px-10 sm:px-20 md:px-40 py-10">
              <LinearProgress />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : filteredTodos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTodos.map((todo) => (
                <div
                  key={todo._id}
                  className="flex flex-col p-5 rounded-lg shadow-lg mt-10 bg-opacity-90 backdrop-blur-md" 
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
                          onClick={() => handleEdit(todo)}
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
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center">No personal todos found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Personal;
