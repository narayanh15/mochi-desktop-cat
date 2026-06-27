# Mochi — desktop cat

Mochi is a tiny interactive pixel cat that hangs from a screen edge using both paws. Stroke the head to pet it, click for a meow, and drag the paws to move it to another corner.

It is a Windows-first Electron app made with plain HTML, CSS, JavaScript, and original watermark-free pixel-art frames. It runs locally and does not need an account, microphone, camera, or internet connection.

## Install the ready-made Windows app

1. Open the `dist` folder.
2. Double-click `Mochi Desktop Cat Setup 0.1.0.exe`.
3. Choose the installation folder and finish installation.
4. Start **Mochi Desktop Cat** from the desktop shortcut or Start menu.

This first personal build is not code-signed. Windows may show a publisher warning; for a public release, sign the installer with a Windows code-signing certificate.

## Step 1: try the visual prototype

Open `index.html` in a browser. No installation is needed.

## Step 2: run the desktop pet

1. Install Node.js 20 LTS or newer.
2. Open PowerShell in this folder.
3. Run `npm.cmd install`.
4. Run `npm.cmd start`.

Mochi appears in the bottom-right corner in a small `132 x 118` transparent window. Drag the paws and release; Mochi snaps to the nearest corner. At a top corner, the cat automatically hangs upside down while speech remains readable.

## Step 3: create a Windows installer

Run `npm.cmd run dist`. The installer is written to the `dist` folder.

## Controls

- Move the pointer back and forth over the head to pet Mochi.
- Click Mochi to hear a tiny synthesized meow.
- Double-click Mochi to create small pixel sparks.
- Right-click and select **Mute sounds** to mute or unmute sounds.
- Drag Mochi by the paws to move it; releasing snaps it to the nearest of four corners.

Right-click Mochi to choose Top left, Top right, Bottom left, or Bottom right; mute sounds; or quit. You can also use `Alt+F4`.

## Customize Mochi

- Change the encouraging sentences in the `messages` list near the top of `app.js`.
- Replace the normal and happy PNG frames in the `assets` folder to change the cat artwork.
- Change the window size or starting position in `main.cjs`.
- Change animation timing and colors in `styles.css`.

## Project files

- `index.html` — the pixel-cat frames and accessible page structure.
- `assets` — transparent normal and happy hanging-cat PNG frames.
- `styles.css` — pixel styling, motion, sparks, and happy-frame switching.
- `app.js` — petting, speech, sparks, mute state, and synthesized meow.
- `main.cjs` — the tiny transparent window, four-corner snapping, top-corner rotation, and context menu.
- `preload.cjs` — the restricted bridge that sends corner and mute changes to the cat UI.
- `package.json` — development and Windows installer configuration.

## Share or contribute

The code uses the MIT License, so other people may use and improve it. Commit the source files to GitHub, but do not commit `node_modules`, `dist`, or Electron cache folders; `.gitignore` already excludes them.

Mochi runs completely locally. It does not collect or send any personal data.
