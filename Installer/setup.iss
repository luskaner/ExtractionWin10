; Script generated by the Inno Script Studio Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "Extraer todo - moderno"
#define MyAppVersion "1.0"
#define MyAppPublisher "luskaner"
#define MyAppURL "https://github.com/luskaner/ExtractionWin10"
#define MyAppExeName "ExtractionWin10.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{71DBBFFF-DCE8-4560-A989-D6A477634FEA}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}/issues
AppUpdatesURL={#MyAppURL}/releases
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputBaseFilename=Instalador de {#MyAppName}
SetupIconFile=..\release\resources\app\icon.ico
Compression=lzma2/ultra64
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
MinVersion=0,10.0
DisableWelcomePage=True
DisableReadyPage=True
DisableReadyMemo=True
DisableFinishedPage=True
UninstallRestartComputer=True
UninstallDisplayName={#MyAppName}
InternalCompressLevel=ultra64
FlatComponentsList=False
AlwaysShowComponentsList=False
ShowComponentSizes=False
AllowCancelDuringInstall=False
DisableDirPage=yes
AllowUNCPath=False
UninstallDisplayIcon={uninstallexe}
ShowLanguageDialog=no

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Files]
Source: "..\release\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"

[Run]
Filename: "{app}\shell\srm.exe"; Parameters: "install ExtractAllExtension.dll -codebase"; Flags: runhidden

[UninstallRun]
Filename: "{app}\shell\srm.exe"; Parameters: "uninstall ExtractAllExtension.dll"; Flags: runhidden
