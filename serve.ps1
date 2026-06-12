# Solo Leveling fitness RPG - local static server (zero dependency)
$Port = 3777
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"; ".jpg" = "image/jpeg"; ".svg" = "image/svg+xml"; ".ico" = "image/x-icon"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:" + $Port + "/")
try {
  $listener.Start()
  Write-Host ("[SYSTEM] LAN mode -> http://localhost:" + $Port + "/")
  Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } |
    ForEach-Object { Write-Host ("[SYSTEM] Phone URL -> http://" + $_.IPAddress + ":" + $Port + "/") }
} catch {
  # No URL ACL permission -> fall back to localhost only
  $listener = New-Object System.Net.HttpListener
  $listener.Prefixes.Add("http://localhost:" + $Port + "/")
  $listener.Start()
  Write-Host ("[SYSTEM] Local-only mode -> http://localhost:" + $Port + "/")
  Write-Host "[SYSTEM] To allow phone access, run once: 手機連線設定(系統管理員).bat"
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
  if ($path -eq "/") { $path = "/index.html" }
  $file = Join-Path $root ($path -replace "/", "\")
  $resolved = $null
  try { $resolved = (Resolve-Path -LiteralPath $file -ErrorAction Stop).Path } catch {}
  if ($resolved -and $resolved.StartsWith($root) -and (Test-Path -LiteralPath $resolved -PathType Leaf)) {
    $bytes = [System.IO.File]::ReadAllBytes($resolved)
    $ext = [System.IO.Path]::GetExtension($resolved).ToLower()
    if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
    $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
  }
  $ctx.Response.Close()
}
