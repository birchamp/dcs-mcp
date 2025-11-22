import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchNotes, fetchWords, fetchQuestions, fetchWordDefinition } from '../api/client';
import clsx from 'clsx';
import { ErrorBoundary } from './ErrorBoundary';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex-1 py-2 text-sm font-medium border-b-2 transition-colors",
      active ? "border-blue-500 text-blue-400" : "border-transparent text-gray-500 hover:text-gray-300"
    )}
  >
    {children}
  </button>
);

export const HelpsPanel = ({ book, chapter, verse }) => {
  const [activeTab, setActiveTab] = useState('notes');
  const [data, setData] = useState({ notes: [], words: [], questions: [] });
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null); // For showing word definition

  useEffect(() => {
    const loadHelps = async () => {
      if (!book || !chapter) return;
      
      setLoading(true);
      try {
        const [notesRes, wordsRes, questionsRes] = await Promise.all([
          fetchNotes(`${book} ${chapter}`),
          fetchWords(`${book} ${chapter}`),
          fetchQuestions(`${book} ${chapter}`)
        ]);

        setData({
          notes: notesRes.items || [],
          words: wordsRes.items || [],
          questions: questionsRes.items || []
        });
        
      } catch (err) {
        console.error("Failed to load helps", err);
      } finally {
        setLoading(false);
      }
    };

    loadHelps();
  }, [book, chapter]);

  // Filter data based on current verse
  const filteredData = {
    notes: data.notes.filter(item => (item.Reference || item.reference) === `${chapter}:${verse}`),
    words: data.words.filter(item => (item.Reference || item.reference) === `${chapter}:${verse}`),
    questions: data.questions.filter(item => (item.Reference || item.reference) === `${chapter}:${verse}`)
  };

  const handleWordClick = async (link) => {
    try {
      const def = await fetchWordDefinition(link);
      setSelectedWord(def);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800">
      <div className="flex border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>Notes</TabButton>
        <TabButton active={activeTab === 'words'} onClick={() => setActiveTab('words')}>Words</TabButton>
        <TabButton active={activeTab === 'questions'} onClick={() => setActiveTab('questions')}>Questions</TabButton>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ErrorBoundary>
          {loading ? (
            <div className="text-gray-500 text-center mt-10">Loading helps...</div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'notes' && filteredData.notes.map((note, i) => {
                // Extract aligned text priority:
                // 1. Bold text (e.g., **word**)
                // 2. Alternate translation (e.g., Alternate translation: [phrase])
                // 3. Quote (Greek/Hebrew)
                
                const boldMatch = note.Note?.match(/\*\*([^*]+)\*\*/);
                const altMatch = note.Note?.match(/Alternate translation: \[([^\]]+)\]/);
                
                const alignedText = boldMatch ? boldMatch[1] : (altMatch ? altMatch[1] : note.Quote);
                
                return (
                  <div key={i} className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/50">
                    {alignedText && (
                      <div className="text-xs text-blue-400 mb-2 font-mono bg-blue-900/20 p-1 rounded inline-block">
                        {alignedText}
                      </div>
                    )}
                    <ReactMarkdown>
                      {note.Note || ''}
                    </ReactMarkdown>
                  </div>
                );
              })}

              {activeTab === 'words' && (
                selectedWord ? (
                  <div>
                    <button onClick={() => setSelectedWord(null)} className="text-xs text-blue-400 mb-2">← Back to list</button>
                    <h3 className="text-xl font-bold text-white mb-4">{selectedWord.title}</h3>
                    <ReactMarkdown>
                      {selectedWord.content} 
                    </ReactMarkdown>
                  </div>
                ) : (
                  filteredData.words.map((word, i) => (
                    <div key={i} 
                         onClick={() => handleWordClick(word.rcLink)}
                         className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 cursor-pointer hover:bg-gray-800 transition-colors"
                    >
                      <div className="font-bold text-gray-200 capitalize">{word.term}</div>
                      <div className="text-sm text-gray-400 mt-1">View Definition</div>
                    </div>
                  ))
                )
              )}

              {activeTab === 'questions' && filteredData.questions.map((q, i) => (
                <div key={i} className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/50">
                  <div className="font-medium text-gray-200 mb-2">{q.Question}</div>
                  <div className="text-sm text-gray-400">{q.Response}</div>
                </div>
              ))}
              
              {/* Empty states */}
              {!loading && filteredData[activeTab].length === 0 && !selectedWord && (
                <div className="text-gray-500 text-center italic">No {activeTab} for this verse.</div>
              )}
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};
