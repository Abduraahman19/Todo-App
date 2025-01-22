import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TextField } from '@mui/material';

export default function DateTimeWithLiveClock() {
  const [date, setDate] = React.useState(dayjs()); // Selected date
  const [currentTime, setCurrentTime] = React.useState(dayjs().format('hh:mm:ss A')); // Current time in 12-hour format

  // Update the current time every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format('hh:mm:ss A')); // 12-hour format with AM/PM
    }, 1000);

    // Clear interval when component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="sm:flex items-center gap-3 space-y-4 p-6">
        {/* Date Calendar */}
        <div className="w-full max-w-md">
          <DateCalendar
            value={date}
            onChange={(newValue) => setDate(newValue)}
            className="border-[1px] border-gray-300 rounded-sm p-4 shadow-neutral-400 shadow-md"
          />
        </div>

        {/* Display current time */}
        <div className="w-full max-w-md">
          <TextField
            label="Current Time"
            value={currentTime}
            InputProps={{
              readOnly: true, // Make time field read-only
            }}
            fullWidth
            className=" border-gray-300 rounded-md p-6 shadow-md"
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
