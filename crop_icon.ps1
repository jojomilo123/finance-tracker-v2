Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("C:\Users\Asus\.gemini\antigravity-ide\brain\01dc3e7b-7102-455c-a815-94b2f9090c09\media__1786890131405.png")

# Find top dark pixel
$top = 0
for ($y = 0; $y -lt $bmp.Height; $y++) {
    $c = $bmp.GetPixel(512, $y)
    if ($c.R -lt 50 -and $c.G -lt 50 -and $c.B -lt 50) {
        $top = $y
        break
    }
}

# Find bottom dark pixel
$bottom = $bmp.Height - 1
for ($y = $bmp.Height - 1; $y -ge 0; $y--) {
    $c = $bmp.GetPixel(512, $y)
    if ($c.R -lt 50 -and $c.G -lt 50 -and $c.B -lt 50) {
        $bottom = $y
        break
    }
}

# Find left dark pixel
$left = 0
for ($x = 0; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, 512)
    if ($c.R -lt 50 -and $c.G -lt 50 -and $c.B -lt 50) {
        $left = $x
        break
    }
}

# Find right dark pixel
$right = $bmp.Width - 1
for ($x = $bmp.Width - 1; $x -ge 0; $x--) {
    $c = $bmp.GetPixel($x, 512)
    if ($c.R -lt 50 -and $c.G -lt 50 -and $c.B -lt 50) {
        $right = $x
        break
    }
}

Write-Host "Crop Box: Left $left, Top $top, Right $right, Bottom $bottom"

# Sample dark navy background color
$bgColor = $bmp.GetPixel(512, 512)
Write-Host "Dark Navy Color: R $(.R) G $(.G) B $(.B)"

$width = $right - $left
$height = $bottom - $top
$cropRect = New-Object System.Drawing.Rectangle($left, $top, $width, $height)
$cropped = $bmp.Clone($cropRect, $bmp.PixelFormat)

# Create 512x512 full bleed icon
$full512 = New-Object System.Drawing.Bitmap(512, 512)
$g = [System.Drawing.Graphics]::FromImage($full512)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::FromArgb(255, $bgColor.R, $bgColor.G, $bgColor.B))

# Draw cropped dark icon filling 100% of full512
$g.DrawImage($cropped, 0, 0, 512, 512)

$full512.Save("d:\finance-tracker\public\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$full512.Save("d:\finance-tracker\public\images\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$full512.Save("d:\finance-tracker\public\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Create 180x180 full bleed apple touch icon
$full180 = New-Object System.Drawing.Bitmap(180, 180)
$g180 = [System.Drawing.Graphics]::FromImage($full180)
$g180.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g180.Clear([System.Drawing.Color]::FromArgb(255, $bgColor.R, $bgColor.G, $bgColor.B))
$g180.DrawImage($cropped, 0, 0, 180, 180)

$full180.Save("d:\finance-tracker\public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$full180.Save("d:\finance-tracker\public\apple-touch-icon-precomposed.png", [System.Drawing.Imaging.ImageFormat]::Png)
$full180.Save("d:\finance-tracker\public\apple-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$full180.Save("d:\finance-tracker\public\favicon.ico", [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$g180.Dispose()
$full512.Dispose()
$full180.Dispose()
$cropped.Dispose()
$bmp.Dispose()
