"use strict";
import { remote } from "electron";
import { ChildProcess, execFile } from "child_process";
import * as path from "path";
const app: Electron.App = remote.app;

const dialog: Electron.Dialog = remote.dialog;
const debug: boolean = remote.getGlobal("debug");

let compressedArchive: string = null;
if (debug) {
    compressedArchive = "S:\\Descargas\\05.613_PAC1_20161_Sol (4).zip";
} else {
    compressedArchive = remote.process.argv[1];
}

let passwordNeeded: boolean = false;
let SevenZipPath: string = path.join(app.getAppPath(), "7zip/7z.exe");

let SevenZip: ChildProcess;
let progressDialog: WinJS.UI.ContentDialog, passwordDialog: WinJS.UI.ContentDialog,
    errorDialog: WinJS.UI.ContentDialog, progress: HTMLProgressElement, filename: HTMLDivElement,
    passwordTextbox: HTMLInputElement, folderPathEl: HTMLInputElement, showExplorerAfterExtract: WinJS.UI.ToggleSwitch,
    errorPassword: HTMLDivElement, warningCase: HTMLDivElement;
let regex: RegExp = /(\d+)%\s(\d+\s)?-\s(.+)/gmi;

function showFolderSelector(): void {
    "use strict";
    let selectedPaths: string[] = dialog.showOpenDialog(
        null,
        {
            title: "Seleccione un destino",
            properties: ["openDirectory"],
            defaultPath: folderPathEl.value
        }
    );

    if (selectedPaths) {
        folderPathEl.value = selectedPaths[0];
    }
}

function procCurrentAction(event: KeyboardEvent): void {
    "use strict";
    if (event.keyCode === 13) {
        if (!errorDialog.hidden) {
            errorDialog.hide();
        } else if (progressDialog.hidden && passwordDialog.hidden) {
            extractArchive();
        }
    }
}

function checkCase(event: KeyboardEvent): void {
    "use strict";
    if (event.getModifierState("CapsLock")) {
        warningCase.style.display = "block";
    } else {
        warningCase.style.display = "none";
    }
}

function loaded(): void {
    "use strict";
    WinJS.UI.processAll().then(() => {
        progressDialog = document.getElementById("progress-dialog").winControl;
        passwordDialog = document.getElementById("password-dialog").winControl;
        errorDialog = document.getElementById("error-dialog").winControl;
        showExplorerAfterExtract = document.getElementById("showExplorerAfterExtractSwitch").winControl;
        window.setTimeout(function (): void {
            folderPathEl.select();
        }, 100);
        remote.getCurrentWindow().show();
    });

    document.getElementsByTagName("body")[0].addEventListener("keydown", procCurrentAction);
    document.getElementById("browseFolderButton").addEventListener("click", showFolderSelector);
    document.getElementById("extractArchiveButton").addEventListener("click", extractArchive);
    document.getElementById("cancelButton").addEventListener("click", () => { remote.app.quit(); });

    progress = document.getElementById("progress") as HTMLProgressElement;
    filename = document.getElementById("filename") as HTMLDivElement;
    errorPassword = document.getElementById("error-password") as HTMLDivElement;
    warningCase = document.getElementById("warning-case") as HTMLDivElement;
    passwordTextbox = document.getElementById("password-textbox") as HTMLInputElement;
    passwordTextbox.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.keyCode == 13) {
            passwordDialog.hide(WinJS.UI.ContentDialog.DismissalResult.primary);
        } else {
            checkCase(event);
        }
    });

    folderPathEl = document.getElementById("folder-path-textbox") as HTMLInputElement;
    folderPathEl.value = path.join(path.dirname(compressedArchive), path.basename(compressedArchive, path.extname(compressedArchive)));
    if (debug) {
        console.log(compressedArchive);
    }
}

function extractArchive(): void {
    "use strict";
    progressDialog.show();
    progressDialog.addEventListener("afterhide", (eventInfo: any) => {
        if (eventInfo.detail.result === WinJS.UI.ContentDialog.DismissalResult.primary) {
            remote.app.quit();
        }
    });

    SevenZip = execFile(SevenZipPath, ["x", compressedArchive, "-bsp1", "-y", `-o${folderPathEl.value}`], (error: any) => {
        remote.getCurrentWindow().setProgressBar(0);
        progressDialog.hide();
        if (error && !passwordNeeded) {
            errorDialog.show();
            errorDialog.addEventListener("afterhide", () => {
                remote.app.quit();
            });
        } else if (!error) {
            progress.value = 100;
            if (showExplorerAfterExtract.checked) {
                execFile("explorer.exe", [folderPathEl.value]);
            }
            window.setTimeout(function (): void {
                remote.app.quit();
            }, 1000);
        } else {
            progress.value = 0;
        }
    });

    SevenZip.stdout.on("data", (data: string) => {
        if (data.indexOf("Enter password (will not be echoed):") > -1) {
            passwordDialog.show();
            passwordTextbox.value = "";
            passwordTextbox.focus();
            passwordDialog.addEventListener("afterhide", (eventInfo: any) => {
                if (eventInfo.detail.result === WinJS.UI.ContentDialog.DismissalResult.secondary) {
                    remote.app.quit();
                } else {
                    SevenZip.stdin.write(`${passwordTextbox.value}\r\n`);
                    passwordNeeded = false;
                }
            });
        }
        let [, percent = 0, num = 0, name = ""] = regex.exec(data) || [];
        if ((name as string).length > 0 && percent >= progress.value) {
            remote.getCurrentWindow().setProgressBar(percent / 100);
            progress.value = percent;
            filename.textContent = name;
        }
        if (debug) {
            console.log(data);
        }
    });

    SevenZip.stderr.on("data", function (data: string): void {
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