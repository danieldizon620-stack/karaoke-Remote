$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$app = Join-Path $project 'webos-app'
$raw = Join-Path $project 'peerjs.original.js'
$compat = Join-Path $app 'peerjs.compat.js'
$urls = @('https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js','https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js')
if (!(Test-Path $raw) -or (Get-Item $raw).Length -lt 10000) {
  foreach ($url in $urls) {
    try {
      Write-Host "Downloading PeerJS: $url"
      Invoke-WebRequest -Uri $url -OutFile $raw -UseBasicParsing -TimeoutSec 45
      if ((Get-Item $raw).Length -gt 10000) { break }
    } catch { Write-Warning $_.Exception.Message }
  }
}
if (!(Test-Path $raw) -or (Get-Item $raw).Length -lt 10000) { throw 'PeerJS download failed.' }
if ((Get-Content $raw -TotalCount 1 | Out-String) -match '<html|<!doctype') { throw 'PeerJS download returned HTML.' }
if (!(Get-Command npm.cmd -ErrorAction SilentlyContinue)) { throw 'Install Node.js before building.' }
if (!(Get-Command ares-package.cmd -ErrorAction SilentlyContinue)) { throw 'Install LG webOS CLI before building.' }
$tools = Join-Path $project '.build-tools'
New-Item -ItemType Directory -Force -Path $tools | Out-Null
if (!(Test-Path (Join-Path $tools 'node_modules\esbuild\bin\esbuild'))) {
  Write-Host 'Installing esbuild build dependency locally...'
  & npm.cmd install --prefix $tools --no-save --no-audit --no-fund esbuild@0.25.12
  if ($LASTEXITCODE -ne 0) { throw 'Could not install esbuild. Check Windows internet connection.' }
}
$esbuild = Join-Path $tools 'node_modules\esbuild\bin\esbuild'
Write-Host 'Transpiling PeerJS for older LG webOS JavaScript...'
& node.exe $esbuild $raw '--target=chrome49' '--format=iife' '--log-level=warning' "--outfile=$compat"
if ($LASTEXITCODE -ne 0 -or !(Test-Path $compat) -or (Get-Item $compat).Length -lt 10000) { throw 'PeerJS compatibility build failed.' }
Write-Host "Compatible PeerJS: $((Get-Item $compat).Length) bytes"
$info = Get-Content (Join-Path $app 'appinfo.json') -Raw | ConvertFrom-Json
Write-Host "Packaging $($info.id) v$($info.version)"
& ares-package.cmd $app -o "$env:USERPROFILE\Downloads"
if ($LASTEXITCODE -ne 0) { throw 'Packaging failed' }
Write-Host "Package expected: $env:USERPROFILE\Downloads\$($info.id)_$($info.version)_all.ipk"
