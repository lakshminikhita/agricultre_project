import React from 'react';

const CSSTest = () => {
  console.log('🧪 CSS Test component loaded');

  return (
    <div style={{ padding: '20px' }}>
      <h1>CSS Test Component</h1>
      
      {/* Raw CSS Test */}
      <div className="raw-css-test">
        Raw CSS Test - This should have red background and white text
      </div>
      
      {/* Tailwind Basic Test */}
      <div className="bg-blue-500 text-white p-4 m-2 rounded">
        Tailwind Test - Blue background, white text
      </div>
      
      {/* Tailwind Grid Test */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-red-500 text-white p-4 text-center">
          Red Box
        </div>
        <div className="bg-green-500 text-white p-4 text-center">
          Green Box
        </div>
      </div>
      
      {/* Tailwind Responsive Test */}
      <div className="bg-purple-500 md:bg-yellow-500 p-4 mt-4 text-white">
        Purple on mobile, Yellow on desktop
      </div>
      
      {/* Custom Button Test */}
      <button className="btn-primary mt-4">
        Custom Button Test
      </button>
      
      {/* Flexbox Test */}
      <div className="flex justify-center items-center bg-gray-200 h-20 mt-4">
        <span className="text-gray-800">Centered Text</span>
      </div>
    </div>
  );
};

export default CSSTest;