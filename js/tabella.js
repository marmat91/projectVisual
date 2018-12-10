var arr = [
    {
        'key': 'a',
        'values': [
            {
                'pk': '1',
                'name': 'allan'
            }, {
                'pk': '2',
                'name': 'ada'
            }
        ]
    }, {
        'key': 'b',
        'values': [
            {
                'pk': '3',
                'name': 'barry'
            }, {
                'pk': '4',
                'name': 'bonds'
            }
        ]
    }
];
console.log(arr[0].key)
console.log(arr[0].values)


console.log(arr.value)
console.log(arr.keys())


update_e2p2(arr[0].key,arr[0].values);

// build table
function update_e2p2(data,columns) {
    console.log(data)
    var table = d3.select('#tabel').append('table')
    var thead = table.append('thead')
    var tbody = table.append('tbody')
    thead.append('tr').selectAll('th').data(columns).enter().append('th').text(function (d) { console.log(d); return d })
    var rows = tbody.selectAll('tr').data(data).enter().append('tr')
    var cells = rows.selectAll('td').data(function(row) {
        return columns.map(function (column) {
            return { column: column, value: row[column] } })
    }).enter().append('td').text(function (d) { return d.value })
    return table;
}