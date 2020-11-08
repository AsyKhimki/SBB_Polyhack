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
        self.connection = sqlite3.connect(str(self.host))
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
    constr_file = Path('.') / 'data' / 'construction-site.json'
    with open(constr_file, mode='r') as read_file:
        constr_data = json.load(read_file)
    print(constr_data[10]['fields'])
    constrs = []
    constrs_ops = []
    ops = get('ops', ('id', 'abbr'))
    ops = {row[1]: row[0] for row in ops}
    id = 0
    constr_ops_id = 0
    for element in constr_data:
        data = element['fields']
        if data.get('bp_to') is not None and data.get('bp_from') is not None:
            if data.get('bp_to') in ops and data.get('bp_from') in ops:
                constrs.append((id, data['region'], data.get('nom_du_project_projektbezeichnung'), 
                            data.get('bemerkungen'), data.get('date_from'), data.get('date_to'), data.get('weeks'), data.get('reduction_capacity'),
                            data.get('umsetzung_intervalltyp_umleitung')))
                constrs_ops.append(((constr_ops_id, id, data.get('bp_from'), 0)))
                constr_ops_id += 1
                constrs_ops.append((constr_ops_id, id, data.get('bp_to'), 1))
                id += 1
                constr_ops_id += 1
    new_constrs_ops = []
    for op in constrs_ops:
        new_constrs_ops.append((op[0], op[1], ops[op[2]], op[3]))
    
    constrs_ops = new_constrs_ops
    with DatabaseCursor(FILE) as cursor:
        sql = ('DROP TABLE IF EXISTS constr_ops;')
        cursor.execute(sql)
        sql = ("CREATE TABLE IF NOT EXISTS constr (id INT PRIMARY KEY, "
               "region TEXT, project TEXT, comments TEXT, date_from DATETIME, date_to DATETIME, weeks INT, red_cap REAL, type TEXT);")
        cursor.execute(sql)
        sql = ("CREATE INDEX IF NOT EXISTS dates ON constr(date_from, date_to);")
        cursor.execute(sql)
        sql = ("CREATE TABLE IF NOT EXISTS constr_ops (id INT PRIMARY KEY, "
               "constr_id INT, op_id INT, sorting INT);")
        cursor.execute(sql)
        sql = ("INSERT OR IGNORE INTO constr (id, region, project, comments, date_from, date_to, weeks, red_cap, type) VALUES (?,?,?,?,?,?,?,?,?);")
        cursor.executemany(sql, constrs)
        sql = ("INSERT OR IGNORE INTO constr_ops (id, constr_id, op_id, sorting) VALUES (?,?,?,?);")
        cursor.executemany(sql, constrs_ops)
