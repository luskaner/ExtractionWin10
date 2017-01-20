path = require("path");
app = require("electron").remote.app;
let SystemColorGetterPath = "color/SystemColorGetter.exe";

if (!require("electron").remote.getGlobal("debug")) {
    SystemColorGetterPath = path.join(app.getAppPath(), SystemColorGetterPath);
}

function getColorValue(callback) {
    if (callback) {
        execFile = require('child_process').execFile;
        execFile(SystemColorGetterPath, (error, stdout) => {
            let [r, g, b, a] = stdout.split(",");
            let accent = { r: r, g: g, b: b };
            callback(accent);
        });
    } else {
        execFileSync = require('child_process').execFileSync;
        let stdout = execFileSync(SystemColorGetterPath).toString();
        let [r, g, b, a] = stdout.split(",");
        return { r: r, g: g, b: b };
    }
}
global.WinJS.Utilities._define("WinJS/Core/_WinRT", () => {
    return {
        Windows: {
            UI: {
                ViewManagement: {
                    UISettings: function () {
                        return {
                            addEventListener: function (event, func) {
                                if (event === "colorvalueschanged") {
                                    let currentAccent = getColorValue(undefined);
                                    window.setInterval(() => {
                                        getColorValue((newAccent) => {
                                            if (currentAccent.r !== newAccent.r || currentAccent.g !== newAccent.g || currentAccent.b !== newAccent.b) {
                                                currentAccent = newAccent;
                                                func();
                                            }
                                        });
                                    }, 1000)
                                }
                            },
                            getColorValue: function (accent) {
                                let accentR = getColorValue(undefined);
                                accent.r = accentR.r;
                                accent.g = accentR.g;
                                accent.b = accentR.b;
                                return accent;
                            }
                        }
                    },
                    UIColorType: {
                        accent: {
                            r: 0,
                            g: 0,
                            b: 0
                        }
                    }
                }
            }
        }
    };
});