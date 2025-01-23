import React, { useState } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import HomeForm from './HomeForm';

function Home() {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <div className='p-5'>
      {!showForm && (
        <div 
          className='w-80 h-80 rounded-lg cursor-pointer text-6xl flex justify-center items-center border border-neutral-500 group transition-all duration-300 hover:border-blue-500 active:scale-95 active:shadow-inner active:shadow-blue-500 active:border-blue-500'
          onClick={handleButtonClick}
        >
          <IoIosAddCircleOutline className='text-neutral-500 group-hover:text-blue-500 transition-colors duration-300' />
        </div>
      )}
      {showForm && <HomeForm onClose={handleFormClose} />}
    </div>
  );
}

export default Home;
