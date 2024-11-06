"use client"

import { useState } from 'react';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [activities, setActivities] = useState<Record<string, string>>({
    '2024-09-13': 'Kang Garda ngasih tugas',
    '2024-09-17': 'Deadline tugas',
  });

  const handleClick = (date: string) => {
    if (activities[date]) {
      setSelectedDate(date);
    }
  };

  const handleToggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  const renderDays = () => {
    const daysInMonth = 30;
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = `2024-09-${String(i).padStart(2, '0')}`;
      const isActivity = !!activities[date];
      const dayClass = `flex items-center justify-center w-10 h-10 p-2 cursor-pointer 
           ${isActivity ? 'hover:bg-red-700' : 'hover:bg-green-800'} 
        rounded-full transition-colors duration-200
        hover: ${isActivity ? 'hover:text-white' : 'hover:text-gray-100'} `;

      days.push(
        <div
          key={date}
          className={dayClass}
          onClick={() => handleClick(date)}
        >
          {i}
          {isActivity && (
            <span className="w-10 h-1 bg-red-500 rounded-full"></span>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <>
      {/* Kalender untuk perangkat kecil */}
      <button
        className="lg:hidden absolute top-16 right-0 m-4 bg-green-800 text-white px-4 py-2 rounded"
        onClick={handleToggleCalendar}
      >
        {showCalendar ? 'Open' : 'Open'}
      </button>

      {/* Kalender besar untuk desktop */}
      <div className={`absolute bg-slate-50 top-0 right-0 p-3 mx-10 my-5 max-w-full lg:w-[25rem] lg:h-[13rem] rounded-lg shadow-xl ${showCalendar ? 'block' : 'hidden lg:block'}`}>
        <h2 className="text-xl mb-2">Kalender</h2>
        <div className="grid grid-cols-10 gap-3 text-center text-lg text-gray-800">
          {renderDays()}
        </div>
      </div>

      {/* Modal Kalender di perangkat kecil */}
      {showCalendar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-4 rounded-lg max-w-xs sm:max-w-sm md:max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Kalender</h2>
              <button
                onClick={handleToggleCalendar}
                className="bg-red-500 text-white px-2 py-2 rounded"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold">
              {renderDays()}
            </div>
          </div>
        </div>
      )}

      {/* Modal Aktivitas */}
      {selectedDate && activities[selectedDate] && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">Schedule {selectedDate}</h2>
            <p>{activities[selectedDate]}</p>
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-4 bg-green-800 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;
