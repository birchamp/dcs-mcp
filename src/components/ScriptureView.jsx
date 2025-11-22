import React, { useEffect, useRef, useState } from 'react';
import { fetchScripture } from '../api/client';
import { parseScriptureText } from '../utils/parser';
import { useInView } from 'framer-motion';

const Chapter = ({ book, chapter, onVerseVisible }) => {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchScripture(`${book} ${chapter}`);
        // Assuming data.scripture is an array, we take the first translation (ULT) usually
        // The example JSON showed `scripture` as an array of objects with `text` and `translation`.
        // We'll prefer 'ULT' or take the first one.
        const ult = data.scripture.find(s => s.translation.includes('ULT')) || data.scripture[0];
        if (ult) {
          setVerses(parseScriptureText(ult.text));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [book, chapter]);

  if (loading) return <div className="p-4 text-gray-400">Loading {book} {chapter}...</div>;
  if (error) return <div className="p-4 text-red-400">Error: {error}</div>;

  return (
    <div className="chapter-container mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">{book} {chapter}</h2>
      <div className="space-y-2">
        {verses.map((verse) => (
          <Verse 
            key={verse.number} 
            verse={verse} 
            chapter={chapter}
            onVisible={() => onVerseVisible(chapter, verse.number)} 
          />
        ))}
      </div>
    </div>
  );
};

const Verse = ({ verse, chapter, onVisible }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20% 0px -50% 0px" }); // Trigger when in upper-middle part of screen
  const onVisibleRef = useRef(onVisible);

  useEffect(() => {
    onVisibleRef.current = onVisible;
  }, [onVisible]);

  useEffect(() => {
    if (isInView) {
      onVisibleRef.current();
    }
  }, [isInView]);

  return (
    <div 
      ref={ref} 
      id={`ch${chapter}-v${verse.number}`}
      className="verse p-2 hover:bg-gray-800/50 rounded transition-colors cursor-pointer"
    >
      <span className="text-xs font-bold text-blue-400 align-top mr-1 select-none">{verse.number}</span>
      <span className="text-gray-300 leading-relaxed">{verse.text}</span>
    </div>
  );
};

export const ScriptureView = ({ book, initialChapter, onVerseChange }) => {
  const [chapters, setChapters] = useState([initialChapter]);
  
  // Infinite scroll handler could go here to add next chapter
  // For simplicity, we'll just load the requested chapter for now, 
  // or add a "Load Next" button at the bottom.
  
  const loadNextChapter = () => {
    const lastChapter = chapters[chapters.length - 1];
    setChapters([...chapters, lastChapter + 1]);
  };

  return (
    <div className="h-full overflow-y-auto p-4 scroll-smooth">
      {chapters.map(ch => (
        <Chapter 
          key={ch} 
          book={book} 
          chapter={ch} 
          onVerseVisible={onVerseChange} 
        />
      ))}
      <button 
        onClick={loadNextChapter}
        className="w-full py-4 mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium border-t border-gray-800"
      >
        Load Next Chapter
      </button>
    </div>
  );
};
