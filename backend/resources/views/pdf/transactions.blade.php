<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transactions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
            background-color: #f8f8f8;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: #fff;
        }
        thead {
            background-color: #007BFF;
            color: white;
        }
        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        th {
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #eaeaea;
        }
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            h1 {
                margin-bottom: 10px;
            }
            table {
                border: none;
            }
            th, td {
                border: 1px solid #000;
                padding: 6px;
            }
        }
    </style>
</head>
<body>
    <h1>User Transactions</h1>
    <table>
        <thead>
            <tr>
                <th>Perusahaan</th>
                <th>Quadrant</th>
                <th>PIC</th>
                <th>Jabatan</th>
                <th>Progress</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transactions as $transaction)
                <tr>
                    <td>{{ $transaction->perusahaan }}</td>
                    <td>{{ $transaction->quadrant }}</td>
                    <td>{{ $transaction->pic }}</td>
                    <td>{{ $transaction->jabatan }}</td>
                    <td>{{ $transaction->progress }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
