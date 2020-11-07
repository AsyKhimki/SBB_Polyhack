import sqlite3
from pathlib import Path

FILE = Path('.') / 'server' / 'data.db'


def get(tbl_name, columns=None, filters=None):
    if columns is None:
        columns = '*'
    else:
        columns = ', '.join(columns)
    sql = f'SELECT {columns} FROM {tbl_name};'
    if filters is not None:
        raise NotImplementedError()
    with DatabaseCursor(FILE) as cursor:
        cursor.execute(sql)
        rows = cursor.fetchall()
    return rows


class DatabaseCursor:
    def __init__(self, host):
        self.connection = None
        self.cursor = None
        self.host = host

    def __enter__(self):
        self.connection = sqlite3.connect(self.host)
        self.cursor = self.connection.cursor()
        return self.cursor

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_tb or exc_val or exc_type:
            self.connection.close()
        else:
            self.connection.commit()
            self.connection.close()


if __name__ == '__main__':
    import json
    linie_file = Path('.') / 'data' / 'linie-mit-betriebspunkten.json'
    with open(linie_file, mode='r') as read_file:
        lines_data = json.load(read_file)
    # print(lines_data[5]['fields'])
    lines_tbl = []
    ops_tbl = []
    line_plan_tbl = []
    for id, line in enumerate(lines_data):
        data = line['fields']
        lines_tbl.append((data['linie'], data['linienname'], data['verwaltung']))
        ops_tbl.append((id, data['abkurzung_bpk'], data['bezeichnung_bpk'], data['bezeichnung_offiziell'], data['geopos'][0], data['geopos'][1], data['didok']))
        line_plan_tbl.append((id, data['linie'], id, data['abkurzung_bps'], data['km']))
    print(lines_tbl[0])
    print(ops_tbl[0])
    print(line_plan_tbl[0])
    map_ops = {}
    maps_nums = {}
    unique_abbr = set()
    new_ops = []
    for op in ops_tbl:
        if not op[1] in unique_abbr:
            new_ops.append(op)
            map_ops[op[1]] = op[0]
            unique_abbr.add(op[1])
        else:
            true_id = map_ops[op[1]]
            maps_nums[op[0]] = true_id
    print(len(new_ops))
    print(len({op[2] for op in line_plan_tbl}))
    new_line_plan_tbl = []
    for plan in line_plan_tbl:
        if maps_nums.get(plan[2]) is not None:
            new_line_plan_tbl.append((plan[0], plan[1], maps_nums[plan[2]], plan[3], plan[4]))
        else:
            new_line_plan_tbl.append(plan)
    print(len({op[2] for op in new_line_plan_tbl}))
    ops_tbl = new_ops
    line_plan_tbl = new_line_plan_tbl
    with DatabaseCursor(FILE) as cursor:
        sql = ('CREATE TABLE IF NOT EXISTS ops (id '
               'INT PRIMARY KEY, abbr TEXT, name TEXT, stop_name TEXT, lat REAL, long REAL, didok INT);')
        cursor.execute(sql)
        sql = ('CREATE TABLE IF NOT EXISTS lines (id '
               'INT PRIMARY KEY, name TEXT, admin TEXT);')
        cursor.execute(sql)
        sql = ('CREATE TABLE IF NOT EXISTS line_plan (id '
               'INT PRIMARY KEY, line_id INT, op_id INT, op_name_line TEXT, km REAL);')
        cursor.execute(sql)
        sql = ('INSERT OR IGNORE INTO lines VALUES(?, ?, ?)')
        cursor.executemany(sql, lines_tbl)
        sql = ('INSERT OR IGNORE INTO ops VALUES(?, ?, ?, ?, ?, ?, ?)')
        cursor.executemany(sql, ops_tbl)
        sql = ('INSERT OR IGNORE INTO line_plan VALUES(?, ?, ?, ?, ?)')
        cursor.executemany(sql, line_plan_tbl)

