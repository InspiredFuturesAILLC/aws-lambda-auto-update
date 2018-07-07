if(!(test-path ./output)) {
    mkdir output
}
Push-Location lambda

Get-ChildItem -Directory | ForEach-Object {
    $zipObj = Get-Item "../output/$_.zip"
    $latest = $_
    Push-Location $_
    Get-ChildItem *.* | ForEach-Object {
        if($latest.LastWriteTime -lt $_.LastWriteTime) {
            $latest = $_
        }
    }
    Pop-Location
    if($latest.LastWriteTime -gt $zipObj.LastWriteTime) {
        Push-Location $_
        npm install
        Remove-Item "../../output/$_.zip" -Force
        7z a "../../output/$_.zip" *
        Pop-Location
    }
}
Pop-Location

$stepCode = (Get-Content ./stepfunction.auto-deploy.json).replace('"', '\"').replace("\r\n", " ").replace("\n", " ").replace("\t", " ")
(Get-Content ./cloudformation.json).replace('#StepFunctionCode#', $stepCode) | Set-Content ./output/cloudformation.json
Copy-Item ./cloudformation.bucketevent.json ./output/cloudformation.bucketevent.json -Force
