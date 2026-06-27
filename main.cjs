const { app, BrowserWindow, Menu, screen } = require("electron");
const path = require("node:path");

const WINDOW_WIDTH = 132;
const WINDOW_HEIGHT = 118;

let mainWindow;
let currentCorner = "bottom-right";
let muted = false;
let snapping = false;
let moveTimer;

function cornerBounds(corner, display) {
  const area = display.workArea;
  const left = area.x;
  const right = area.x + area.width - WINDOW_WIDTH;
  const top = area.y;
  const bottom = area.y + area.height - WINDOW_HEIGHT;
  return {
    x: corner.endsWith("left") ? left : right,
    y: corner.startsWith("top") ? top : bottom,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  };
}

function notifyCorner() {
  if (!mainWindow?.isDestroyed()) {
    mainWindow.webContents.send("corner-change", currentCorner);
  }
}

function snapToCorner(corner, display = screen.getDisplayMatching(mainWindow.getBounds())) {
  currentCorner = corner;
  snapping = true;
  mainWindow.setBounds(cornerBounds(corner, display), true);
  notifyCorner();
  setTimeout(() => { snapping = false; }, 180);
}

function snapToNearestCorner() {
  const bounds = mainWindow.getBounds();
  const display = screen.getDisplayMatching(bounds);
  const area = display.workArea;
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;
  const horizontal = centerX < area.x + area.width / 2 ? "left" : "right";
  const vertical = centerY < area.y + area.height / 2 ? "top" : "bottom";
  snapToCorner(`${vertical}-${horizontal}`, display);
}

function showContextMenu() {
  const cornerItems = [
    ["Top left", "top-left"],
    ["Top right", "top-right"],
    ["Bottom left", "bottom-left"],
    ["Bottom right", "bottom-right"],
  ].map(([label, corner]) => ({
    label,
    type: "radio",
    checked: currentCorner === corner,
    click: () => snapToCorner(corner),
  }));

  Menu.buildFromTemplate([
    { label: "Move to", submenu: cornerItems },
    {
      label: "Mute sounds",
      type: "checkbox",
      checked: muted,
      click: (item) => {
        muted = item.checked;
        mainWindow.webContents.send("mute-change", muted);
      },
    },
    { type: "separator" },
    { label: "Quit Mochi", role: "quit" },
  ]).popup({ window: mainWindow });
}

function createWindow() {
  const display = screen.getPrimaryDisplay();
  mainWindow = new BrowserWindow({
    ...cornerBounds(currentCorner, display),
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.setAlwaysOnTop(true, "floating");
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    snapToCorner(currentCorner, display);
  });
  mainWindow.webContents.on("did-finish-load", notifyCorner);
  mainWindow.webContents.on("context-menu", showContextMenu);

  mainWindow.on("moved", () => {
    if (snapping) return;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(snapToNearestCorner, 220);
  });
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
