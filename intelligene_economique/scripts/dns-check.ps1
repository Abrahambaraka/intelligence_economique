Write-Host "🔍 DNS Monitoring Started for intelligenceconomique.com" -ForegroundColor Cyan
Write-Host "Target IP: 195.35.3.36" -ForegroundColor White
Write-Host "Checking every 5 minutes..." -ForegroundColor Yellow
Write-Host ""

$checkNumber = 1

while ($true) {
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] Check #$checkNumber" -ForegroundColor White
    
    $dnsTest = nslookup intelligenceconomique.com 2>&1
    if ($dnsTest -match "195.35.3.36") {
        Write-Host "✅ SUCCESS! DNS propagated!" -ForegroundColor Green
        Write-Host "Domain intelligenceconomique.com now points to 195.35.3.36" -ForegroundColor Green
        break
    } else {
        Write-Host "⏳ DNS not propagated yet. Next check in 5 minutes..." -ForegroundColor Yellow
    }
    
    $checkNumber++
    Start-Sleep 300
}