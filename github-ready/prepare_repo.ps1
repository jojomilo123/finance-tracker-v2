param(
  [Parameter(Mandatory=$true)]
  [string]$RemoteUrl
)

if (-not (Test-Path -Path .git)) {
  git init
}

git add .
git commit -m "chore: initial commit"

git branch -M main 2>$null
try {
  git remote add origin $RemoteUrl
} catch {
  git remote set-url origin $RemoteUrl
}

git push -u origin main --force
Write-Host "Pushed to $RemoteUrl"