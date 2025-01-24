import React from 'react';
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

const DAYJS_CODEC = {
    parse: (dateString) => dayjs(dateString),
    stringify: (date) => date.toISOString(),
};

export default function App() {
    const [dateValue, setDateValue] = useLocalStorageState('custom-value', null, {
        codec: DAYJS_CODEC,
    });

    return (
        <div className="p-10">
            <div className="relative">
                <div className="absolute left-0">
                    <UnstyledButton />
                </div>
                <h1 className="text-5xl font-bold font-sans text-center">Add Note</h1>
            </div>

            <div className="mt-10">
                <BasicTextFields dateValue={dateValue} setDateValue={setDateValue} />
            </div>
        </div>
    );
}

function BasicTextFields({ dateValue, setDateValue }) {
    const handleClear = (event) => {
        event.preventDefault();
        setDateValue(null);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-row-2 lg:grid-row-2 gap-6">
            <Box
                component="form"
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4"
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="outlined-title"
                    label="Title"
                    variant="outlined"
                    className="w-full h-12 p-2"
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

            <Box
                component="form"
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="outlined-description"
                    label="Description"
                    variant="outlined"
                    className="w-full h-12 p-2"
                    multiline
                    rows={4}
                />

                <Box className="w-full pt-16 sm:pt-0">
                    <SelectSmall />
                </Box>
            </Box>
        </div>
    );
}

function SelectSmall() {
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: '100%' }} size="medium">
            <InputLabel id="demo-select-small-label">List</InputLabel>
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={age}
                label="Age"
                onChange={handleChange}
                className="h-12 p-2"
            >
                <MenuItem value={10}>Nothing</MenuItem>
                <MenuItem value={20}>Personal</MenuItem>
                <MenuItem value={30}>Work</MenuItem>
            </Select>
        </FormControl>
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
