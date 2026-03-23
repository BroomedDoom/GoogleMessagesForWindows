$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot\..

Write-Host 'Installing dependencies...'
npm install

Write-Host 'Running syntax checks...'
npm run check

Write-Host 'Building Windows portable executable...'
npx electron-builder --win portable

Write-Host 'Done. Look in the release folder for the .exe artifact.'
