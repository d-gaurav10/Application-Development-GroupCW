import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to BookBazzar</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Book list will go here */}
        </div>
      </div>
    </div>
  );
};

export default Home;