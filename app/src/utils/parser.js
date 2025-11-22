/**
 * Parses scripture text into an array of verse objects.
 * Expected format: "1 Verse one text... 2 Verse two text..."
 * @param {string} text 
 * @returns {Array<{number: number, text: string}>}
 */
export const parseScriptureText = (text) => {
  if (!text) return [];

  // Regex to match verse numbers at the start of lines or sentences.
  // This is a heuristic and might need adjustment based on exact USFM/text format.
  // The example output showed "1 Text... \n2 Text..."
  
  // We'll split by verse numbers.
  // Look for a number followed by a space or newline, but ensure it's likely a verse number.
  // A simple approach: split by `\n<number> ` or just `<number> ` if at start.
  
  const verses = [];
  // Remove newlines that are just formatting, but keep them if they mark verses?
  // Actually, the example JSON showed: "1 Paul... \n2 with..."
  // So we can look for `\n` followed by a number.
  
  // Let's normalize newlines first.
  const normalized = text.replace(/\r\n/g, '\n');
  
  // Split by verse number pattern: start of string or newline followed by number and space.
  // We capture the number to use it.
  const parts = normalized.split(/(?:^|\n)(\d+)\s/);
  
  // parts[0] might be empty or intro text.
  // parts[1] = verse number, parts[2] = verse text, parts[3] = verse number...
  
  for (let i = 1; i < parts.length; i += 2) {
    const number = parseInt(parts[i], 10);
    const content = parts[i + 1].trim();
    verses.push({ number, text: content });
  }
  
  return verses;
};
