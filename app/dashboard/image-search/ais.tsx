'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WordSearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchedWord, setSearchedWord] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // State to hold the image URL

  // Function to handle the search action
  async function handleSearch() {
    // Set the searched word in the frontend
    setSearchedWord(searchInput);

    // Send the search input to the backend and get the image URL
    try {
      const response = await fetch('/api/search-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: searchInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.imageUrl); // Assuming backend returns an imageUrl field
      } else {
        console.error('Failed to fetch image from the backend');
      }
    } catch (error) {
      console.error('An error occurred while fetching:', error);
    }
  }

  return (
    <div className="min-h-[100vh]">
      <div className="flex-col items-center justify-center text-center md:flex">
        <div className="w-full pb-1 pt-4">
          <h1 className="text-center text-2xl font-medium text-dark md:text-4xl">
            Word Search and Image
          </h1>
        </div>
      </div>

      <div className="relative mx-auto mt-[27px] w-full max-w-[900px] px-5 md:mt-[45px]">
        <h2 className="text-center text-2xl font-bold mb-6">Word Search</h2>

        {/* Search box and button */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter a word"
            className="w-full p-2 border border-gray-300 rounded"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-dark text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {/* Two text boxes side by side */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 border border-gray-300 rounded">
            <p>
              {searchedWord ? searchedWord : 'Input word will be shown here'}
            </p>
          </div>
          <div className="p-4 border border-gray-300 rounded">
            <p>Description of the word will appear here</p>
          </div>
        </div>

        {/* Image component */}
        <div className="text-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Word related image"
              className="mx-auto mb-4"
            />
          ) : (
            <p>No image available for the word</p>
          )}
        </div>
      </div>

      {/* Link at the bottom */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center justify-center">
        <Link
          className="rounded-[7px] bg-dark px-5 py-[15px] text-[17px] leading-[79%] tracking-[-0.75px] text-light md:text-xl lg:px-[37px]"
          style={{ boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
          href="/dashboard/action-items"
        >
          View All Grammar Feedback
        </Link>
      </div>
    </div>
  );
}
