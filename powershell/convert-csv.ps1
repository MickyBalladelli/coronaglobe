$data = import-csv $PSScriptRoot\data.csv

$newData = @()

foreach ($e in $data) 
{
    $o = [PSCustomObject]@{
        country = $e.Country_Region
        lat = $e.Lat
        lng = $e.Long_
    }

    $newData += $o
}
$newData | select country, lat, lng | export-csv $PSScriptRoot\countries.csv -NoTypeInformation -Delimiter ','