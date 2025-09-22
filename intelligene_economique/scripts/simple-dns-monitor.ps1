# Simple DNS Monitoring Script
$Domain = "intelligenceconomique.com"
$VpsIp = "195.35.3.36"

Write-Host "🔍 Monitoring DNS propagation for $Domain" -ForegroundColor Cyan
Write-Host "Expected IP: $VpsIp" -ForegroundColor White
Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Yellow
Write-Host ""

$counter = 0
while ($true) {
    $counter++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    Write-Host "[$timestamp] Check #$counter - Testing DNS resolution..." -ForegroundColor White
    
    try {
        $result = Resolve-DnsName -Name $Domain -ErrorAction SilentlyContinue
        if ($result -and $result.IPAddress -eq $VpsIp) {
            Write-Host "✅ SUCCESS! DNS propagated successfully!" -ForegroundColor Green
            Write-Host "Domain $Domain now resolves to $VpsIp" -ForegroundColor Green
            Write-Host "🔒 You can now configure SSL certificate" -ForegroundColor Yellow
            break
        } else {
            Write-Host "⏳ DNS not yet propagated. Waiting 5 minutes..." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⏳ DNS resolution failed. Waiting 5 minutes..." -ForegroundColor Yellow
    }
    
    Start-Sleep -Seconds 300  # Wait 5 minutes
}

Write-Host "Monitoring completed!" -ForegroundColor Green