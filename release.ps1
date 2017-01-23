$buildPath = '.\release'
$appPath = "$buildPath\resources\app"
$debugPath = 'bin\Release\'

$shellExt = 'ExtractAllExtension'

# Build all the code
& "E:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\IDE\devenv.exe" ExtractionWin10.sln /Build Release /projectconfig Release   

# Prepare the build directory
if (Test-Path -Path $buildPath){
    Remove-Item -Recurse $buildPath
}

# Copy the electron base
Copy-Item -Recurse .\electron $buildPath

# Copy the shell extension
New-Item -ItemType directory $buildPath\shell
Copy-Item .\$shellExt\$shellExt\$debugPath\$shellExt.dll $buildPath\shell
Copy-Item .\$shellExt\$shellExt\$debugPath\SharpShell.dll $buildPath\shell
Copy-Item .\$shellExt\tools\srm.exe $buildPath\shell

# Copy the app
Copy-Item -Recurse .\ExtractionWin10 $appPath

# Copy the Color getter auxiliar app
New-Item -ItemType directory $appPath\color
Copy-Item ".\SystemColorGetter\SystemColorGetter\bin\Release\SystemColorGetter.exe" $appPath\color

# Create the installer
& "C:\Program Files (x86)\Inno Setup 5\ISCC.exe" .\installer\setup.iss