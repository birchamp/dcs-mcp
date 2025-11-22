import React from 'react';
import { BIBLE_BOOKS } from '../utils/bibleBooks';

export const BookSelector = ({ currentBook, onBookChange }) => {
  return (
    <select
      value={currentBook}
      onChange={(e) => onBookChange(e.target.value)}
      className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
    >
      {BIBLE_BOOKS.map((book) => (
        <option key={book} value={book}>
          {book}
        </option>
      ))}
    </select>
  );
};
