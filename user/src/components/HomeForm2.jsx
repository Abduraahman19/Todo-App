import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSnackbar } from 'notistack';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function HomeForm2({ editTodo, onClose, onUpdate }) {
    const { enqueueSnackbar } = useSnackbar();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#000000');
    const [text, setText] = useState('');
    const [dateValue, setDateValue] = useState(null);

    useEffect(() => {
        if (editTodo) {
            setTitle(editTodo.title || '');
            setDescription(editTodo.description || '');
            setColor(editTodo.backgroundColor || '#000000');
            setText(editTodo.list || '');
            setDateValue(editTodo.date ? dayjs(editTodo.date) : null);
        }
    }, [editTodo]);

    const handleUpdateTodo = async () => {
        if (!editTodo || !editTodo._id) {
            enqueueSnackbar('Invalid Todo. Please try again.', { variant: 'error' });
            return;
        }

        if (!title || !description || !color || !text || !dateValue) {
            enqueueSnackbar('Please fill out all fields before submitting.', { variant: 'error' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                enqueueSnackbar('User not authenticated. Please log in.', { variant: 'error' });
                return;
            }

            const updatedTodo = {
                title,
                description,
                date: dateValue ? dateValue.toISOString() : '',
                backgroundColor: color,
                list: text,
            };

            const response = await axios.put(
                `http://localhost:5000/api/todo/${editTodo._id}`,
                updatedTodo,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            enqueueSnackbar('Todo updated successfully!', { variant: 'success' });

            if (onUpdate) {
                onUpdate({ ...editTodo, ...updatedTodo });
            }

            onClose();

            window.location.reload();

        } catch (error) {
            console.error('Error updating todo:', error);

            if (!navigator.onLine) {
                enqueueSnackbar('No internet connection. Please check your network.', { variant: 'error' });
            } else if (error.code === 'ERR_NETWORK') {
                enqueueSnackbar('Server is unreachable. Please check if your backend is running.', { variant: 'error' });
            } else if (error.response) {
                enqueueSnackbar(`Error: ${error.response.data.message || 'Failed to update'}`, { variant: 'error' });
            } else {
                enqueueSnackbar('Unknown error occurred. Please try again.', { variant: 'error' });
            }
        }
    };

    return (
        <div className="p-10">
            <div className='flex justify-center mb-14'>
                <div className='bg-neutral-700 w-48 sm:h-14 rounded-md shadow-lg shadow-neutral-500 text-white content-center text-3xl font-bold text-center font-sans'>
                    EDIT TODO
                </div>
            </div>
            <Box component="form" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextField 
                    label="Title" 
                    variant="outlined" 
                    className="w-full" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label="Pick a Date" 
                        value={dateValue} 
                        onChange={(newValue) => setDateValue(newValue)} 
                        className="w-full" 
                    />
                </LocalizationProvider>
                <TextField 
                    label="Description" 
                    variant="outlined" 
                    className="w-full" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    multiline 
                    rows={4} 
                />
                <FormControl fullWidth>
                    <InputLabel>List</InputLabel>
                    <Select 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        label="List"
                    >
                        <MenuItem value="Nothing">Nothing</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                        <MenuItem value="Work">Work</MenuItem>
                    </Select>
                </FormControl>
                <div className="flex items-center gap-2">
                    <label>Background Color</label>
                    <input 
                        type="color" 
                        value={color} 
                        onChange={(e) => setColor(e.target.value)} 
                        className="h-10 w-10 rounded-md border shadow-md cursor-pointer" 
                    />
                    <span>{color}</span>
                </div>
            </Box>
            <div className="mt-6 flex justify-center gap-4">
                <Button variant="contained" color="primary" onClick={handleUpdateTodo}>
                    Update Todo
                </Button>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export default HomeForm2;
