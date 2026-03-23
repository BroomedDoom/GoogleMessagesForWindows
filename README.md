# Google Messages for Windows

A lightweight Electron shell for **Google Messages for web** that feels more like an Android desktop companion than a plain browser tab.

## What it adds

- A dedicated Windows desktop app shell around `messages.google.com/web/conversations`
- An Android-inspired dark layout with rounded panels and softened spacing
- One-click actions for search, compact density mode, and refresh
- Keyboard shortcuts such as `Ctrl/Cmd + K` for quick search and `F5` for reload
- Persistent Google session storage via `persist:google-messages`

## Development

```bash
npm install
npm start
```

## Build a Windows `.exe`

This project is now configured for **electron-builder** to produce a **portable Windows executable**.

### On a Windows machine

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-windows.ps1
```

Or run the steps manually:

```bash
npm install
npm run check
npm run dist:win
```

The generated executable will be written to the `release/` folder as:

- `GoogleMessagesForWindows-0.1.0-portable.exe`

## Why the `.exe` was not generated in this container

I could not produce the final Windows `.exe` artifact inside this environment because:

- the container is Linux-based rather than Windows-based
- Electron binaries could not be downloaded here due upstream/network policy restrictions
- there is no preinstalled Windows Electron runtime or Windows packaging toolchain available

So the repository is set up to build the `.exe`, but the actual packaging step needs to be run in a Windows environment with npm access.

## Notes

- This app uses the official Google Messages web experience inside an Electron `webview`.
- The injected styling depends on Google Messages' internal DOM and may need updates if Google changes their web UI.
- If you want to take this further, the next useful steps would be native notifications, unread badges, a system tray icon, startup launch options, and code signing for Windows builds.
