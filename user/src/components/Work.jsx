import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import { MdDelete, MdEdit } from "react-icons/md";
import HomeForm from './HomeForm';
import HomeForm2 from './HomeForm2';

function TodayTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeForm, setActiveForm] = useState(null);  // State for active form
  const [editTodo, setEditTodo] = useState(null); // State for the todo being edited

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

  const handleEditButtonClick = (todo, formType) => {
    setEditTodo(todo);
    setActiveForm(formType); // Dynamically set active form
  };

  const handleFormClose = () => {
    setActiveForm(null); // Close the form
    setEditTodo(null); // Clear edit todo
  };

  return (
    <div className="p-5 min-h-screen">
      <div className="flex justify-center">
        <h2 className="text-3xl font-bold text-center shadow-neutral-700 shadow-xl bg-[#737373] p-4 rounded">
          Today's Todos
        </h2>
      </div>

      {/* Only render TodayTodos if activeForm is null */}
      {activeForm === null && (
        <>
          {loading ? (
            <div className="w-full px-10 sm:px-20 md:px-40 py-10">
              <LinearProgress />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : todos.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="flex flex-col pt-4 pl-4 pb-3 rounded-lg mt-5 shadow-neutral-700 shadow-xl"
                  style={{ backgroundColor: todo.backgroundColor || '#f0f0f0' }}
                >
                  <div className="text-lg w-40 text-white mb-auto flex-grow">
                    <div className='font-bold text-3xl'>{todo.title}</div>
                    <div className='font-medium text-xl'>{todo.description}</div>
                  </div>

                  <div className="flex space-x-3 mt-8">
                    <div className='mt-7 space-x-3'>
                      <button onClick={() => handleEditButtonClick(todo, "HomeForm2")}
                        className="text-blue-500 hover:text-blue-700 transition rounded-lg h-10 w-9 hover:bg-white border-blue-600 px-1 border focus:outline-none">
                        <MdEdit size={24} />
                      </button>
                      <button onClick={() => handleDelete(todo._id)} className="text-red-500 hover:text-red-700 transition rounded-md border h-10 w-9 px-1 border-red-500 hover:bg-red-100 focus:outline-none">
                        <MdDelete size={24} />
                      </button>
                    </div>
                    <div className='pt-5 text-xl font-semibold text-white font-sans'>
                      <div className=''>{new Date(todo.date).toLocaleDateString()}</div>
                      <div className=''>{todo.list}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No todos for today.</p>
          )}
        </>
      )}

      {/* Conditionally render the forms based on activeForm */}
      {activeForm === "HomeForm" && <HomeForm onClose={handleFormClose} editTodo={editTodo} />}
      {activeForm === "HomeForm2" && <HomeForm2 onClose={handleFormClose} editTodo={editTodo} />}
    </div>
  );
}

export default TodayTodos;
