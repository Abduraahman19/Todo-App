import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function DateTimeWithLiveClock() {
  const [date, setDate] = React.useState(dayjs()); 
  const [currentTime, setCurrentTime] = React.useState(
    dayjs().format("hh:mm:ss A")
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("hh:mm:ss A"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
              onChange={(newValue) => setDate(newValue)}
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
    </LocalizationProvider>
  );
}