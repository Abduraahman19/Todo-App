import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function DateTimeWithLiveClock() {
  const [date, setDate] = React.useState(dayjs()); // Selected date
  const [currentTime, setCurrentTime] = React.useState(
    dayjs().format("hh:mm:ss A")
  ); // Current time in 12-hour format

  // Update the current time every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("hh:mm:ss A")); // 12-hour format with AM/PM
    }, 1000);

    // Clear interval when component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 p-6">
        {/* Date Calendar */}
        <div className="w-full max-w-sm text-neutral-300 bg-neutral-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg text-white font-semibold text-center mb-4">
            Select a Date
          </h2>
          <div className="bg-neutral-800 rounded-xl p-4">
            <DateCalendar
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{
                color: '#FFFFFF', // Set all text color to white
                '& .MuiTypography-root': {
                  color: '#FFFFFF', // Ensures all text inside the calendar inherits white color
                },
                '& .MuiPickersDay-root': {
                  color: '#FFFFFF', // Set default color for days to white
                  '&:hover': {
                    backgroundColor: '#3B82F6', // Optional hover effect for days
                  },
                },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#2563EB', // Tailwind's `blue-600`
                  color: '#FFFFFF', // White for selected text
                },
                '& .MuiButtonBase-root': {
                  color: '#FFFFFF', // Set color for the navigation buttons (next, previous)
                },
                '& .MuiPickersCalendarHeader-root': {
                  color: '#FFFFFF', // Set color for the month/year header to white
                },
                '& .MuiPickersArrowSwitcher-root': {
                  color: '#FFFFFF', // Set color for the arrows (previous, next month) to white
                },
              }}
            />
          </div>
        </div>


        {/* Display current time */}
        <div className="w-full max-w-sm bg-neutral-700 border-gray-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-white text-center mb-4">Current Time</h2>
          <div className="w-full text-center text-lg bg-neutral-800 text-white py-5 rounded-lg">
            {currentTime}
          </div>
        </div>

      </div>
    </LocalizationProvider>
  );
}
