import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import axios from 'axios';
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md'; // Import delete icon
import LinearProgress from '@mui/material/LinearProgress';

export default function DateTimeWithLiveClock() {
  const [date, setDate] = React.useState(dayjs());
  const [currentTime, setCurrentTime] = React.useState(dayjs().format("hh:mm:ss A"));
  const [todos, setTodos] = React.useState([]);
  const [filteredTodos, setFilteredTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("hh:mm:ss A"));
    }, 1000);

    const fetchTodos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/todos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTodos(response.data.todos);
        filterTodosForDate(date);
      } catch (err) {
        console.error('Error fetching todos:', err);
        setError('Error fetching todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();

    return () => clearInterval(interval);
  }, [date]);

  const filterTodosForDate = (selectedDate) => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const filtered = todos.filter(todo => {
      const todoDate = dayjs(todo.date).format("YYYY-MM-DD");
      return todoDate === formattedDate;
    });
    setFilteredTodos(filtered);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
console.log(id);
console.log(token);


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
      })
      .catch(err => {
        console.error('Error deleting todo:', err);
        setError('Error deleting todo');
      });
  };
  const handleEdit = (todo) => {
    // Placeholder for the edit functionality, implement it as needed
    console.log('Editing todo:', todo);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 p-6">
        <div className="w-full max-w-sm text-neutral-300 bg-neutral-700 rounded-xl p-2 sm:p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg text-white font-semibold text-center mb-4">
            Select a Date
          </h2>
          <div className="bg-neutral-800 rounded-xl">
            <DateCalendar
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
                filterTodosForDate(newValue);
              }}
              sx={{
                color: '#FFFFFF',
                '& .MuiTypography-root': {
                  color: '#FFFFFF',
                },
                '& .MuiPickersDay-root': {
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#3B82F6',
                  },
                },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                },
                '& .MuiButtonBase-root': {
                  color: '#FFFFFF',
                },
                '& .MuiPickersCalendarHeader-root': {
                  color: '#FFFFFF',
                },
                '& .MuiPickersArrowSwitcher-root': {
                  color: '#FFFFFF',
                },
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-sm bg-neutral-700 border-gray-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-white text-center mb-4">Current Time</h2>
          <div className="w-full text-center text-lg bg-neutral-800 text-white py-5 rounded-lg">
            {currentTime}
          </div>
        </div>
      </div>

      <div className="p-5 min-h-screen">
        <div className="flex justify-center">
          <h2 className="text-3xl font-bold text-center shadow-neutral-700 shadow-xl bg-[#737373] p-4 rounded">
            Todos for {date.format("YYYY-MM-DD")}
          </h2>
        </div>

        {loading ? (
          <div className="w-full px-10 sm:px-20 md:px-40 py-10">
            <LinearProgress />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredTodos.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredTodos.map((todo) => (
              <li key={todo._id} className="mb-2">
                <div
                  className="flex flex-col pt-4 pl-4 pb-3 rounded-lg mt-5 shadow-neutral-700 shadow-xl"
                  style={{ backgroundColor: todo.backgroundColor || '#2D3748' }}
                >
                  <div className="text-lg w-40 text-white mb-auto flex-grow">
                    <div className='font-bold text-3xl'>{todo.title}</div>
                    <div className='font-medium text-xl'>{todo.description}</div>
                  </div>

                  <div className="flex space-x-3 mt-8">
                    <div className='mt-7 space-x-3'>
                      <button onClick={() => handleEdit(todo)} className="text-blue-500 hover:text-blue-700 transition rounded-lg h-10 w-9 hover:bg-white border-blue-600 px-1 border focus:outline-none">
                        <MdEdit size={24} />
                      </button>
                      {/* Delete Button */}
                      <button onClick={() => handleDelete(todo._id)} className="text-red-500 hover:text-red-700 transition rounded-lg h-10 w-9 hover:bg-white border-red-600 px-1 border focus:outline-none">
                        <MdDelete size={24} />
                      </button>
                    </div>
                    <div className='pt-5 text-xl font-semibold text-white font-sans'>
                      <div className=''>{new Date(todo.date).toLocaleDateString()}</div>
                      <div className=''>{todo.list}</div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No todos for this date.</p>
        )}
      </div>
    </LocalizationProvider>
  );
}
