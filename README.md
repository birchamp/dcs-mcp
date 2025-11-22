# DCS MCP - Translation Helps Navigator

A React application for navigating unfoldingWord's translation helps, synchronized with scripture references.

## Features

- **Scripture Navigation**: Browse Bible books, chapters, and verses.
- **Translation Notes**: View notes aligned with the scripture, including Greek/Hebrew quotes and English alignment.
- **Translation Words**: Access definitions for key biblical terms.
- **Translation Questions**: See comprehension questions for the current chapter.
- **Responsive Design**: Works on desktop and mobile with a modern dark mode UI.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd dcs-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build

Build the application for production:

```bash
npm run build
```

The output will be in the `dist/` directory.

## Project Structure

- `src/`: Source code
  - `components/`: React components (ScriptureView, HelpsPanel, etc.)
  - `api/`: API client for fetching data
  - `utils/`: Utility functions
- `public/`: Static assets
