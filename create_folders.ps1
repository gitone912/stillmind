# PowerShell script to create all folders under src directory
# Run this in your new app's root directory

$folders = @(
    "src\api",
    "src\assets\home",
    "src\assets\icons",
    "src\assets\journalCovers",
    "src\assets\settingsIcons",
    "src\components",
    "src\hooks",
    "src\navigation",
    "src\onboarding",
    "src\screens\HomePageScreens",
    "src\screens\JournalPageScreens",
    "src\screens\SessionPageScreens",
    "src\screens\SettingPageScreens",
    "src\services",
    "src\store\slices",
    "src\utils"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "Created: $folder"
    } else {
        Write-Host "Already exists: $folder"
    }
}

Write-Host "`nAll folders created successfully!"

