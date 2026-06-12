Add-Type -AssemblyName System.Drawing
foreach ($size in 192,512) {
  $bmp = New-Object System.Drawing.Bitmap($size,$size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  $g.Clear([System.Drawing.Color]::FromArgb(255,4,7,15))

  $penW = [Math]::Max(4, [int]($size/40))
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255,61,200,255), $penW)
  $m = [int]($size*0.08)
  $g.DrawRectangle($pen, $m, $m, $size-2*$m, $size-2*$m)

  $pen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120,61,200,255), [Math]::Max(2,[int]($penW/2)))
  $m2 = [int]($size*0.13)
  $g.DrawRectangle($pen2, $m2, $m2, $size-2*$m2, $size-2*$m2)

  $fontSize = [int]($size*0.42)
  $font = New-Object System.Drawing.Font('Arial', $fontSize, [System.Drawing.FontStyle]::Bold)
  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,61,200,255))
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = 'Center'
  $sf.LineAlignment = 'Center'
  $y = [float]($size*0.02)
  $rect = New-Object System.Drawing.RectangleF(0.0, $y, [float]$size, [float]$size)
  $g.DrawString('S', $font, $brush, $rect, $sf)

  $g.Dispose()
  $bmp.Save("C:\Users\user\Desktop\solo-leveling\icon-$size.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "icon-$size.png OK"
}
