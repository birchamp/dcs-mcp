const BASE_URL = import.meta.env.PROD 
  ? 'https://translation-helps-mcp-945.pages.dev' 
  : '/api';

export const fetchScripture = async (reference) => {
  const response = await fetch(`${BASE_URL}/fetch-scripture?reference=${encodeURIComponent(reference)}`);
  if (!response.ok) throw new Error('Failed to fetch scripture');
  return response.json();
};

export const fetchNotes = async (reference) => {
  const response = await fetch(`${BASE_URL}/fetch-translation-notes?reference=${encodeURIComponent(reference)}`);
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
};

export const fetchQuestions = async (reference) => {
  const response = await fetch(`${BASE_URL}/fetch-translation-questions?reference=${encodeURIComponent(reference)}`);
  if (!response.ok) throw new Error('Failed to fetch questions');
  return response.json();
};

export const fetchWords = async (reference) => {
  const response = await fetch(`${BASE_URL}/fetch-translation-word-links?reference=${encodeURIComponent(reference)}`);
  if (!response.ok) throw new Error('Failed to fetch word links');
  return response.json();
};

export const fetchWordDefinition = async (link) => {
  // The API expects an rcLink parameter.
  const response = await fetch(`${BASE_URL}/fetch-translation-word?rcLink=${encodeURIComponent(link)}`);
  if (!response.ok) throw new Error('Failed to fetch word definition');
  return response.json();
};
