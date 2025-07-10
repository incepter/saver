> This was entirely AI generated. No human was involved in writing 
> or reviewing this code.

# Saver App

A web application for saving frequently used text snippets like passwords, URLs, and tunnels. The app works completely offline and stores all data in the browser's localStorage.

## Features

- Create folders to organize your saved items
- Create sections within folders for logical grouping
- Add, edit, and delete saved items
- Mask sensitive information with ability to view when needed
- Copy saved values to clipboard with a single click
- Export and import data as JSON
- Works offline with service worker caching
- Synchronizes data across multiple tabs
- Dark mode support
- Responsive design for mobile and desktop
- Chrome extension for quick access (optional)

## Tech Stack

- Vite
- TypeScript
- React
- Tailwind CSS
- PWA (Progressive Web App)

## Setup and Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

4. Preview the production build:
   ```
   npm run preview
   ```

## Project Structure

- `src/` - Source code
  - `components/` - React components
  - `hooks/` - Custom React hooks
  - `types.ts` - TypeScript interfaces
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `index.css` - Global styles and Tailwind imports
- `chrome-extension/` - Chrome extension files
  - `manifest.json` - Extension manifest
  - `background.js` - Extension background script
  - `README.md` - Extension setup instructions

## Chrome Extension

See the [Chrome Extension README](./chrome-extension/README.md) for setup instructions.

## Usage Example

1. Create a folder (e.g., "CMI")
2. Create a section within the folder (e.g., "agg-merchant")
3. Add items to the section:
   - agg-merchant-url (an URL)
   - agg-merchant-user (username)
   - agg-merchant-password (password)
   - agg-merchant-tunnel (SSH tunnel)
4. Use the eye icon to view the value, the edit icon to modify it, and the copy icon to copy it to clipboard

## License

MIT
