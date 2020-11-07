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