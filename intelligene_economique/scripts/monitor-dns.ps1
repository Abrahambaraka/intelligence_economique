param(
    [string]$Domain = "intelligenceconomique.com",
    [string]$VpsIp = "195.35.3.36"
)

function Write-ColorStatus {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Test-DomainResolution {
    param($Domain, $ExpectedIP)
    
    try {
        $dnsResult = Resolve-DnsName -Name $Domain -ErrorAction SilentlyContinue
        if ($dnsResult -and $dnsResult.IPAddress -contains $ExpectedIP) {
            return $true
        }
    } catch {
        return $false
    }
    return $false
}

Write-ColorStatus "🔍 Starting DNS monitoring for $Domain -> $VpsIp" "Cyan"
Write-ColorStatus "Checking every 5 minutes. Press Ctrl+C to stop." "Yellow"

$maxChecks = 288  # 24 hours
$checkCount = 0

while ($checkCount -lt $maxChecks) {
    $checkCount++
    
    Write-ColorStatus "Check $checkCount/$maxChecks - Testing DNS..." "White"
    
    if (Test-DomainResolution -Domain $Domain -ExpectedIP $VpsIp) {
        Write-ColorStatus "✅ SUCCESS! DNS is propagated!" "Green"
        Write-ColorStatus "Your domain $Domain now points to $VpsIp" "Green"
        Write-ColorStatus "🔒 Next step: Configure SSL manually" "Yellow"
        exit 0
    }
    
    Write-ColorStatus "⏳ Not propagated yet. Next check in 5 minutes..." "Yellow"
    Start-Sleep -Seconds 300
}

Write-ColorStatus "⏰ Monitoring stopped after 24 hours" "Red"