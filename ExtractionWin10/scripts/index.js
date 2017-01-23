"use strict";
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path = require("path");
const app = electron_1.remote.app;
const dialog = electron_1.remote.dialog;
const debug = electron_1.remote.getGlobal("debug");
let compressedArchive = null;
if (debug) {
    compressedArchive = "S:\\Descargas\\05.613_PAC1_20161_Sol (4).zip";
}
else {
    compressedArchive = electron_1.remote.process.argv[1];
}
let passwordNeeded = false;
let SevenZipPath = path.join(app.getAppPath(), "7zip/7z.exe");
let SevenZip;
let progressDialog, passwordDialog, errorDialog, progress, filename, passwordTextbox, folderPathEl, showExplorerAfterExtract, errorPassword, warningCase;
let regex = /(\d+)%\s(\d+\s)?-\s(.+)/gmi;
function showFolderSelector() {
    "use strict";
    let selectedPaths = dialog.showOpenDialog(null, {
        title: "Seleccione un destino",
        properties: ["openDirectory"],
        defaultPath: folderPathEl.value
    });
    if (selectedPaths) {
        folderPathEl.value = selectedPaths[0];
    }
}
function procCurrentAction(event) {
    "use strict";
    if (event.keyCode === 13) {
        if (!errorDialog.hidden) {
            errorDialog.hide();
        }
        else if (progressDialog.hidden && passwordDialog.hidden) {
            extractArchive();
        }
    }
}
function checkCase(event) {
    "use strict";
    if (event.getModifierState("CapsLock")) {
        warningCase.style.display = "block";
    }
    else {
        warningCase.style.display = "none";
    }
}
function loaded() {
    "use strict";
    WinJS.UI.processAll().then(() => {
        progressDialog = document.getElementById("progress-dialog").winControl;
        passwordDialog = document.getElementById("password-dialog").winControl;
        errorDialog = document.getElementById("error-dialog").winControl;
        showExplorerAfterExtract = document.getElementById("showExplorerAfterExtractSwitch").winControl;
        window.setTimeout(function () {
            folderPathEl.select();
        }, 100);
        electron_1.remote.getCurrentWindow().show();
    });
    document.getElementsByTagName("body")[0].addEventListener("keydown", procCurrentAction);
    document.getElementById("browseFolderButton").addEventListener("click", showFolderSelector);
    document.getElementById("extractArchiveButton").addEventListener("click", extractArchive);
    document.getElementById("cancelButton").addEventListener("click", () => { electron_1.remote.app.quit(); });
    progress = document.getElementById("progress");
    filename = document.getElementById("filename");
    errorPassword = document.getElementById("error-password");
    warningCase = document.getElementById("warning-case");
    passwordTextbox = document.getElementById("password-textbox");
    passwordTextbox.addEventListener("keydown", (event) => {
        if (event.keyCode == 13) {
            passwordDialog.hide(WinJS.UI.ContentDialog.DismissalResult.primary);
        }
        else {
            checkCase(event);
        }
    });
    folderPathEl = document.getElementById("folder-path-textbox");
    folderPathEl.value = path.join(path.dirname(compressedArchive), path.basename(compressedArchive, path.extname(compressedArchive)));
    if (debug) {
        console.log(compressedArchive);
    }
}
function extractArchive() {
    "use strict";
    progressDialog.show();
    progressDialog.addEventListener("afterhide", (eventInfo) => {
        if (eventInfo.detail.result === WinJS.UI.ContentDialog.DismissalResult.primary) {
            electron_1.remote.app.quit();
        }
    });
    SevenZip = child_process_1.execFile(SevenZipPath, ["x", compressedArchive, "-bsp1", "-y", `-o${folderPathEl.value}`], (error) => {
        electron_1.remote.getCurrentWindow().setProgressBar(0);
        progressDialog.hide();
        if (error && !passwordNeeded) {
            errorDialog.show();
            errorDialog.addEventListener("afterhide", () => {
                electron_1.remote.app.quit();
            });
        }
        else if (!error) {
            progress.value = 100;
            if (showExplorerAfterExtract.checked) {
                child_process_1.execFile("explorer.exe", [folderPathEl.value]);
            }
            window.setTimeout(function () {
                electron_1.remote.app.quit();
            }, 1000);
        }
        else {
            progress.value = 0;
        }
    });
    SevenZip.stdout.on("data", (data) => {
        if (data.indexOf("Enter password (will not be echoed):") > -1) {
            passwordDialog.show();
            passwordTextbox.value = "";
            passwordTextbox.focus();
            passwordDialog.addEventListener("afterhide", (eventInfo) => {
                if (eventInfo.detail.result === WinJS.UI.ContentDialog.DismissalResult.secondary) {
                    electron_1.remote.app.quit();
                }
                else {
                    SevenZip.stdin.write(`${passwordTextbox.value}\r\n`);
                    passwordNeeded = false;
                }
            });
        }
        let [, percent = 0, num = 0, name = ""] = regex.exec(data) || [];
        if (name.length > 0 && percent >= progress.value) {
            electron_1.remote.getCurrentWindow().setProgressBar(percent / 100);
            progress.value = percent;
            filename.textContent = name;
        }
        if (debug) {
            console.log(data);
        }
    });
    SevenZip.stderr.on("data", function (data) {
        if (data.indexOf("Wrong password") > -1) {
            errorPassword.style.display = "block";
            passwordNeeded = true;
            extractArchive();
        }
        if (debug) {
            console.log(data);
        }
    });
}
//# sourceMappingURL=index.js.map