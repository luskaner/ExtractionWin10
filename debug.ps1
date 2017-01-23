$buildPath = '.\debug'
$appPath = "$buildPath\resources\app"
$debugPath = 'bin\Debug\'

$shellExt = 'ExtractAllExtension'

# Build all the code
& "E:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\IDE\devenv.exe" ExtractionWin10.sln /Build Debug /projectconfig Debug 

# Prepare the build directory
if (Test-Path -Path $buildPath){
    Remove-Item -Recurse $buildPath
}

# Copy the electron base
Copy-Item -Recurse .\electron $buildPath

# Copy the app
Copy-Item -Recurse .\ExtractionWin10 $appPath

# Copy the Color getter auxiliar app
New-Item -ItemType directory $appPath\color
Copy-Item ".\SystemColorGetter\SystemColorGetter\bin\Debug\SystemColorGetter.exe" $appPath\color

& $buildPath\ExtractionWin10.exe