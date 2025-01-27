import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';

const DAYJS_CODEC = {
    parse: (dateString) => dayjs(dateString),
    stringify: (date) => date.toISOString(),
};

function App() {
    const { enqueueSnackbar } = useSnackbar(); // Hook for snackbar notifications
    const [dateValue, setDateValue] = useLocalStorageState('custom-value', null, {
        codec: DAYJS_CODEC,
    });
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#000000');
    const [text, setText] = useState('');

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Check if the form is valid
    const isFormValid = title && description && color && text && dateValue;

    const handleAddTodo = async () => {
        if (!isFormValid) {
            // If the form is incomplete, show an error snackbar
            enqueueSnackbar('Please fill out all fields before submitting.', { variant: 'error' });
            return;
        }

        const date = dateValue ? dateValue.toISOString() : null;

        try {
            const response = await axios.post('http://localhost:5000/api/todo',
                { title, description, date, backgroundColor: color, list: text },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            // Show success snackbar when a todo is added successfully
            enqueueSnackbar('Todo added successfully!', { variant: 'success' });

            // Clear the form fields after successful submission
            setTitle('');
            setDescription('');
            setColor('#000000');
            setText('');
            setDateValue(null);
        } catch (err) {
            // Handle error
            enqueueSnackbar(err.response?.data?.message || 'An error occurred. Please try again.', { variant: 'error' });
        }
    };

    return (
        <div className="p-10">
            <div className="relative">
                <div className="absolute left-0">
                    <UnstyledButton />
                </div>
                <h1 className="text-5xl font-bold font-sans text-center">Add Note</h1>
            </div>

            <div className="mt-10">
                <BasicTextFields
                    dateValue={dateValue}
                    setDateValue={setDateValue}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    text={text}
                    setText={setText}
                    color={color}
                    setColor={setColor}
                />
            </div>

            <div className="flex justify-center mt-10">
                <Button
                    variant="contained"
                    color="primary"
                    className="w-48"
                    onClick={handleAddTodo}>
                    Add Todo
                </Button>
            </div>
        </div>
    );
}

function BasicTextFields({ dateValue, setDateValue, title, setTitle, description, setDescription, text, setText, color, setColor }) {
    const handleClear = (event) => {
        event.preventDefault();
        setDateValue(null);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-row-2 lg:grid-row-2 gap-6">
            <Box component="form" className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4" noValidate autoComplete="off">
                <TextField
                    id="outlined-title"
                    label="Title"
                    variant="outlined"
                    className="w-full h-12 p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack direction="row" spacing={2}>
                        <DatePicker
                            label="Pick a Date"
                            value={dateValue}
                            onChange={(newValue) => setDateValue(newValue)}
                            className="w-full h-12 p-2"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition-all duration-150 transform hover:scale-105"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </Stack>
                </LocalizationProvider>
            </Box>

            <Box component="form" className="grid grid-cols-1 sm:grid-cols-2 gap-6" noValidate autoComplete="off">
                <TextField
                    id="outlined-description"
                    label="Description"
                    variant="outlined"
                    className="w-full h-12 p-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                />
                <Box className="w-full pt-16 sm:pt-0">
                    <SelectSmall text={text} setText={setText} color={color} setColor={setColor} />
                </Box>
            </Box>
        </div>
    );
}

function SelectSmall({ text, setText, color, setColor }) {
    const handleColorChange = (event) => {
        setColor(event.target.value);
    };

    const handleSelectChange = (event) => {
        setText(event.target.value);
    };

    return (
        <div className="gap-4">
            <FormControl sx={{ m: 1, minWidth: '99%' }} size="medium">
                <InputLabel id="demo-select-small-label">List</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={text}
                    label="List"
                    onChange={handleSelectChange}
                    className="h-12 p-2"
                >
                    <MenuItem value="Nothing">Nothing</MenuItem>
                    <MenuItem value="Personal">Personal</MenuItem>
                    <MenuItem value="Work">Work</MenuItem>
                </Select>
            </FormControl>

            <div className="flex items-center gap-2">
                <h1 className="font-medium text-lg">Background Color</h1>
                <input
                    type="color"
                    name="Pick a Color"
                    value={color}
                    onChange={handleColorChange}
                    className="h-10 w-10 rounded-md border shadow-md cursor-pointer transition-transform duration-200 hover:scale-110 focus:outline-none"
                />
            </div>

            <div className="font-medium mt-2">Selected Color: {color}</div>
        </div>
    );
}

function UnstyledButton() {
    return (
        <button
            className="hidden sm:block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition-all duration-150 transform hover:scale-105"
            onClick={() => window.location.reload()}
        >
            Go Home
        </button>
    );
}

export default function IntegrationNotistack() {
    return (
        <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <App />
        </SnackbarProvider>
    );
}
