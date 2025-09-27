# Notes SaaS Frontend Server Status
Write-Host "🚀 Notes SaaS Frontend Development Server Status" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if Node processes are running
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -like "*node*" }
if ($nodeProcesses) {
    Write-Host "✅ Node.js processes running:" -ForegroundColor Green
    $nodeProcesses | Format-Table ProcessName, Id, CPU, WorkingSet -AutoSize
} else {
    Write-Host "❌ No Node.js processes found" -ForegroundColor Red
}

# Test server connection
Write-Host "`n🌐 Testing server connection..." -ForegroundColor Yellow
try {
    $connection = Test-NetConnection -ComputerName localhost -Port 5173 -InformationLevel Quiet
    if ($connection) {
        Write-Host "✅ Server is accessible at http://localhost:5173" -ForegroundColor Green
        Write-Host "🎉 Your Notes SaaS frontend is ready!" -ForegroundColor Green
        Write-Host "`n📝 Features available:" -ForegroundColor Cyan
        Write-Host "   - Home page with welcome message" -ForegroundColor White
        Write-Host "   - Login functionality" -ForegroundColor White
        Write-Host "   - Notes management" -ForegroundColor White
        Write-Host "   - Admin panel" -ForegroundColor White
        Write-Host "`n💡 Open your browser and navigate to: http://localhost:5173" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Server is not responding on port 5173" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Connection test failed: " -NoNewline -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n🔧 To stop the server, run: Get-Process *node* | Stop-Process" -ForegroundColor Gray