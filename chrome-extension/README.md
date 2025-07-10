# Saver Chrome Extension

This Chrome extension provides quick access to the Saver app from your browser toolbar.

## Setup Instructions

1. Create or obtain icon files for the extension:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
   
   You can create these icons using any image editing software or use online icon generators.

2. Update the `APP_URL` in `background.js` to point to your deployed Saver app URL.

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" using the toggle in the top-right corner
   - Click "Load unpacked" and select this directory
   - The extension should now appear in your browser toolbar

4. Click the extension icon to open the Saver app in a new tab.

## Notes

- This extension requires the "tabs" permission to open a new tab with the Saver app.
- The extension works offline once installed, but the Saver app itself needs to be cached by the service worker to work offline.
