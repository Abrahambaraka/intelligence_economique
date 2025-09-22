param(
    [string]$Domain = "intelligenceconomique.com",
    [string]$VpsIp = "195.35.3.36"
)

function Write-Status {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Test-DNSPropagation {
    param($Domain, $ExpectedIP)
    
    try {
        $result = Resolve-DnsName -Name $Domain -ErrorAction SilentlyContinue
        if ($result -and $result.IPAddress -contains $ExpectedIP) {
            return $true
        }
    } catch {
        # DNS resolution failed
    }
    return $false
}

Write-Status "🔍 Monitoring DNS propagation for $Domain -> $VpsIp" "Cyan"
Write-Status "Press Ctrl+C to stop monitoring" "Yellow"

$maxAttempts = 288  # 24 hours (5min intervals)
$attempts = 0

while ($attempts -lt $maxAttempts) {
    $attempts++
    
    Write-Status "Attempt $attempts/$maxAttempts - Testing DNS propagation..." "White"
    
    if (Test-DNSPropagation -Domain $Domain -ExpectedIP $VpsIp) {
        Write-Status "✅ SUCCESS! DNS propagated for $Domain" "Green"
        Write-Status "🔒 You can now configure SSL manually:" "Yellow"
        Write-Status "   ssh user@$VpsIp" "White"
        Write-Status "   sudo certbot --nginx -d $Domain --non-interactive --agree-tos --email admin@$Domain" "White"
        break
    } else {
        Write-Status "⏳ DNS not yet propagated. Waiting 5 minutes..." "Yellow"
        Start-Sleep -Seconds 300  # 5 minutes
    }
}

if ($attempts -ge $maxAttempts) {
    Write-Status "⏰ Monitoring timeout reached (24 hours)" "Red"
    Write-Status "Please check DNS configuration manually" "Yellow"
}