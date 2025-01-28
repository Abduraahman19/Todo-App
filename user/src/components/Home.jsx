import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios for making API calls
import { IoIosAddCircleOutline } from "react-icons/io";
import HomeForm from './HomeForm';
import LinearProgress from '@mui/material/LinearProgress';  // Import LinearProgress from MUI

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [todos, setTodos] = useState([]); // State to hold the fetched todos
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null); // State to manage any errors

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  useEffect(() => {
    // Fetch data from the API on component mount
    setLoading(true);  // Set loading to true while fetching data

    // Get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, make the API call with the token
    if (token) {
      axios
        .get('http://localhost:5000/api/todos', {
          headers: {
            Authorization: `Bearer ${token}`  // Send the token in the Authorization header
          }
        })
        .then((response) => {
          // Log the full API response to console
          console.log('API Response:', response.data);

          // Assuming response.data contains an array of todos
          const todosData = Array.isArray(response.data.todos) ? response.data.todos : [];
          setTodos(todosData);  // Set the fetched data into the state
          setLoading(false);  // Set loading to false after data is fetched
        })
        .catch((err) => {
          // Handle any errors
          setError(err.message);  // Set error state if something goes wrong
          setLoading(false);  // Set loading to false even if there's an error
          console.error('Error fetching todos:', err);  // Log the error
        });
    } else {
      setLoading(false);  // If no token, stop loading
      setError('No token found');
    }
  }, []);  // Empty dependency array to make the API call only once when the component mounts

  return (
    <div className='justify-center sm:justify-start p-5 min-h-screen'>
      {loading ? (
        <div className="w-full py-10"> {/* Center the loader vertically */}
          <LinearProgress />  {/* MUI LinearProgress as the loader */}
        </div>
      ) : error ? (
        <div>Error: {error}</div>  // Show error message if there's an error
      ) : (
        <div>
          {/* Conditionally render todos data only if the form is not being shown */}
          {!showForm && Array.isArray(todos) && todos.length > 0 ? (
            <ul>
              {todos.map((todo) => (
                <li key={todo.id} className="mb-4 p-4 border-b"
                  style={{
                    backgroundColor: todo.backgroundColor || '#f0f0f0', // Use background color from todo or default
                  }}
                >
                  <div className='text-lg text-white'>
                    {/* Displaying title, description, date, list, and background color */}
                    <div><strong className=''>Title:</strong> {todo.title}</div>
                    <div><strong>Description:</strong> {todo.description}</div>
                    <div><strong>Date:</strong> {new Date(todo.date).toLocaleDateString()}</div>
                    <div><strong>List:</strong> {todo.list}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !showForm && <div><h1 className='text-center justify-center font-bold text-2xl'>No todos found. Add one to get started!</h1></div>
          )}
        </div>
      )}

      {/* Add the button below the todos or form */}
      {!showForm && (
        <div 
          className='w-80 h-80 rounded-lg cursor-pointer text-6xl flex justify-center items-center border border-neutral-500 group transition-all duration-300 hover:border-blue-500 active:scale-95 active:shadow-inner active:shadow-blue-500 active:border-blue-500 mt-5'
          onClick={handleButtonClick}
        >
          <IoIosAddCircleOutline className='text-neutral-500 group-hover:text-blue-500 transition-colors duration-300' />
        </div>
      )}

      {/* Conditionally render the HomeForm component */}
      {showForm && <HomeForm onClose={handleFormClose} />}
    </div>
  );
}

export default Home;
