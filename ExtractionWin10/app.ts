import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import * as electron_context_menu from "electron-context-menu";

// keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow;
global["debug"] = false;

function createWindow(): void {
    "use strict";
    if (!global["debug"]) {
        if (process.argv.length !== 2) {
            app.quit();
        }
    }

    let show = false;

    if (global["debug"]){
        show = true;
    }

    // create the browser window.
    win = new BrowserWindow({
        width: 614,
        height: 454,
        maximizable: false,
        title: "Extraer carpetas comprimidas",
        icon: "icon.ico",
        resizable: false,
        show: show
    });

    if (global["debug"]) {
        win.setSize(win.getSize()[0] * 2, win.getSize()[1]);
        win.setResizable(true);
        win.setMaximizable(true);
    }

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
    }));

    win.setMenu(null);

    if (global["debug"]) {
        win.webContents.openDevTools();
    }

    // emitted when the window is closed.
    win.on("closed", () => {
        // dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

electron_context_menu({
    labels: {
        cut: "Cortar",
        copy: "Copiar",
        paste: "Pegar"
    },
    showInspectElement: false
});

// this method will be called when Electron has finished
// initialization and is ready to create browser windows.
// some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// quit when all windows are closed.
app.on("window-all-closed", () => {
    app.quit();
});
