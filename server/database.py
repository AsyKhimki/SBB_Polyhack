import sqlite3
from pathlib import Path

FILE = Path('.') / 'server' / 'data.db'


def get(tbl_name, columns=None, filters=None):
    if columns is None:
        columns = '*'
    else:
        columns = ', '.join(columns)
    sql = f'SELECT {columns} FROM {tbl_name};'
    filter_list = []
    if filters is not None:
        sql = sql[:-1] + ' WHERE '
        placeholders = [f'{filter[0]} {filter[1]} ? {filter[3]}' for filter in filters]
        placeholders.pop()
        placeholders.append(f'{filters[-1][0]} {filters[-1][1]} ?')
        sql = sql + ' '.join(placeholders) + ';'
        for col, op, val, con in filters:
            filter_list.append(val)
    with DatabaseCursor(FILE) as cursor:
        if filter_list:
            cursor.execute(sql, filter_list)
        else:
            cursor.execute(sql)
        rows = cursor.fetchall()
    return rows

def join_get(sql):
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
    constr_file = Path('.') / 'data' / 'zugzahlen.json'
    with open(constr_file, mode='r') as read_file:
        constr_data = json.load(read_file)
    print(constr_data[10]['fields'])
    constrs = []
    ops = get('ops', ('id', 'abbr'))
    ops = {row[1]: row[0] for row in ops}
    id = 0
    constr_ops_id = 0
    for element in constr_data:
        data = element['fields']
        if data.get('bp_bis_abschnitt') is not None and data.get('bp_von_abschnitt') is not None:
            if data.get('bp_bis_abschnitt') in ops and data.get('bp_von_abschnitt') in ops:
                constrs.append((id, data['in_richtung'], data.get('geschaeftscode'),
                            data.get('anzahl_zuege'), data.get('bp_von_abschnitt'), data.get('bp_bis_abschnitt')))
                id += 1
    new_constrs = []
    for op in constrs:
        new_constrs.append((op[0], op[1], op[2], op[3], ops[op[4]], ops[op[5]]))
    
    constrs = new_constrs
    with DatabaseCursor(FILE) as cursor:
        sql = ('DROP TABLE IF EXISTS capacities;')
        cursor.execute(sql)
        sql = ("CREATE TABLE IF NOT EXISTS capacities (id INT PRIMARY KEY, "
               "direction BOOL, train_type TEXT, train_number REAL, op_from_id INT, op_to_id INT);")
        cursor.execute(sql)
        sql = ("INSERT OR IGNORE INTO capacities (id, direction, train_type, train_number, op_from_id, op_to_id) VALUES (?,?,?,?,?,?);")
        cursor.executemany(sql, constrs)
