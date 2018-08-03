# ExtractionWin10
Modern version of the builtin Windows "Extract All" dialog with multiple archive support.

*The windows-like interface is provided by the WinJS library inside an electron executable which uses the 7-Zip backend to uncompress files*.

## Structure

* `ExtractionWin10`: Main program.
* `SystemColorGetter`: Queries the system about the current window color tone.
* `ExtractAllExtension`: Shell extension to integrate into Windows Explorer.
* `Installer`: The Installer source code itself (Inno Script Studio Wizard)
* `electron`: Electron binaries.

## Requirements

* Windows 10.
* Visual Studio 2015.
* Inno Script Studio Wizard.
* 7-Zip.

## Build
### Debug configuration
Execute `debug.bat`
### Release configuration
Execute `release.bat`
