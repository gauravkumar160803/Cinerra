// WatchlistHero.jsx
import React from 'react';

export default function WatchlistHero() {
  return (
    // Set padding top for the 80px margin and use full screen width/height
    <div 
      style={{ paddingTop: 80, minHeight: '100vh' }} 
      className="w-full flex items-center justify-center bg-gray-50 p-4"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-700">
          Working on Favourites........
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          (Come back later!!)
        </p>
      </div>
    </div>
  );
}