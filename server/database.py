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
    print('Careful!')
    exit()
