# Script de surveillance DNS et configuration SSL automatique
# Une fois le DNS propagé, ce script configurera SSL automatiquement

param(
    [string]$Domain = "intelligenceconomique.com",
    [string]$ServerIP = "195.35.3.36",
    [string]$VPSUser = "root",
    [int]$CheckInterval = 300  # 5 minutes
)

function Test-DNSPropagation {
    param([string]$Domain)
    
    try {
        $result = Resolve-DnsName -Name $Domain -Type A -ErrorAction Stop
        if ($result.IPAddress -contains "195.35.3.36") {
            return $true
        }
    }
    catch {
        return $false
    }
    return $false
}

function Write-Status {
    param([string]$Message, [string]$Color = "Green")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

Write-Status "🔍 Surveillance DNS pour $Domain" "Cyan"
Write-Status "Vérification toutes les $($CheckInterval/60) minutes"
Write-Status "IP cible: $ServerIP"

$attempts = 0
$maxAttempts = 288  # 24 heures avec vérification toutes les 5 minutes

while ($attempts -lt $maxAttempts) {
    $attempts++
    
    Write-Status "Tentative $attempts/$maxAttempts - Vérification DNS..."
    
    if (Test-DNSPropagation -Domain $Domain) {
        Write-Status "✅ DNS propagé ! Configuration SSL en cours..." "Green"
        
        # Configuration SSL automatique
        try {
            $sslCommand = "certbot --nginx -d $Domain -d www.$Domain --non-interactive --agree-tos --email admin@$Domain"
            
            Write-Status "Exécution: ssh $VPSUser@$ServerIP '$sslCommand'"
            
            $result = ssh "$VPSUser@$ServerIP" $sslCommand
            
            if ($LASTEXITCODE -eq 0) {
                Write-Status "🎉 SSL configuré avec succès !" "Green"
                Write-Status "🌐 Votre site est maintenant accessible via:"
                Write-Status "   - https://$Domain" "Cyan"
                Write-Status "   - https://www.$Domain" "Cyan"
                
                # Test final
                Write-Status "Test de connexion HTTPS..."
                try {
                    $response = Invoke-WebRequest -Uri "https://$Domain" -UseBasicParsing -TimeoutSec 10
                    if ($response.StatusCode -eq 200) {
                        Write-Status "✅ Site accessible en HTTPS !" "Green"
                    }
                }
                catch {
                    Write-Status "⚠️ Site peut mettre quelques minutes à être accessible" "Yellow"
                }
                
                break
            }
            else {
                Write-Status "❌ Erreur lors de la configuration SSL" "Red"
                Write-Status "Résultat: $result" "Red"
            }
        }
        catch {
            Write-Status "❌ Erreur SSH: $_" "Red"
        }
        break
    }
    else {
        $timeRemaining = [math]::Round(($maxAttempts - $attempts) * $CheckInterval / 3600, 1)
        Write-Status "❌ DNS pas encore propagé. Nouvelle vérification dans $($CheckInterval/60) min (reste ~$timeRemaining h)" "Yellow"
        
        # Test alternatif avec nslookup
        try {
            $nslookup = nslookup $Domain 2>$null
            if ($nslookup) {
                Write-Status "nslookup result: $($nslookup -join ' ')" "Gray"
            }
        }
        catch {}
        
        Start-Sleep -Seconds $CheckInterval
    }
}

if ($attempts -ge $maxAttempts) {
    Write-Status "⏰ Timeout atteint. Vérifications manuelles recommandées:" "Yellow"
    Write-Status "1. Vérifiez la configuration DNS dans votre panel Hostinger"
    Write-Status "2. Utilisez https://dnschecker.org pour vérifier la propagation"
    Write-Status "3. Une fois propagé, exécutez manuellement:"
    Write-Status "   ssh user@195.35.3.36 'certbot --nginx -d intelligenceconomique.com --non-interactive --agree-tos --email admin@intelligenceconomique.com'"
}