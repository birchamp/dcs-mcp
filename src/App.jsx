import React, { useState, useCallback } from 'react';
import { ScriptureView } from './components/ScriptureView';
import { HelpsPanel } from './components/HelpsPanel';
import { BookSelector } from './components/BookSelector';

function App() {
  const [book, setBook] = useState('Titus'); // Default book
  const [chapter, setChapter] = useState(1);
  const [currentVerse, setCurrentVerse] = useState(1);

  const handleVerseChange = useCallback((ch, v) => {
    // Only update if changed to avoid excessive re-renders/fetches
    setChapter(prevCh => prevCh !== ch ? ch : prevCh);
    setCurrentVerse(prevV => prevV !== v ? v : prevV);
  }, []);

  const handleBookChange = (newBook) => {
    setBook(newBook);
    setChapter(1);
    setCurrentVerse(1);
  };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-white overflow-hidden font-sans">
      {/* Sidebar / Header could go here */}
      
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto shadow-2xl overflow-hidden">
        {/* Left Panel: Scripture */}
        <div className="flex-1 flex flex-col border-r border-gray-800 min-w-0">
          <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur z-10">
            <div className="flex items-center gap-4">
              <BookSelector currentBook={book} onBookChange={handleBookChange} />
              <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {book} {chapter}
              </h1>
            </div>
            <div className="text-sm font-mono text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              Verse {currentVerse}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ScriptureView 
              book={book} 
              initialChapter={1} 
              onVerseChange={handleVerseChange} 
            />
          </div>
        </div>

        {/* Right Panel: Helps */}
        <div className="flex-1 h-1/2 md:h-full">
          <HelpsPanel 
            book={book} 
            chapter={chapter} 
            verse={currentVerse} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
