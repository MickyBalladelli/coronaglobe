$data = import-csv $PSScriptRoot\countries.csv

$data | ConvertTo-Json -Depth 10 -Compress | out-file -FilePath $PSScriptRoot\countries.json