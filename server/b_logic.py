import database as db


def all_mock_ops():
    """
    Fallback function for returning all the mock ops
    table_name: mock_ops
    schema: <id int, name text, lat real, long real>
    """

    fields = ('name', 'lat', 'long')
    rows = db.get('mock_ops', fields)
    return [{'name': row[0], 'lat':row[1], 'long':row[2]} for row in rows]


def all_ops():
    """
    returns all operating points
    table_name: ops
    """
    fields = ('name', 'abbr', 'lat', 'long', 'didok')
    rows = db.get('ops', fields)
    return [{
                'name': row[0],
                'abbreviation': row[1],
                'lat': row[2],
                'long': row[3],
                'didok': row[4]
            } for row in rows]


def all_lines():
    """dirty one for now"""
    rows = db.get('lines')
    line_dict = {row[0]: {'lnumber': row[0], 'name': row[1], 'admin': row[2], 'ops':[]} for row in rows}
    
    sql = 'SELECT line_id, op_id, km, abbr, name, lat, long, didok FROM ops INNER JOIN line_plan ON ops.id = line_plan.op_id ORDER BY line_id, km ASC;'

    rows = db.join_get(sql)
    for row in rows:
        line_dict[row[0]]['ops'].append(
            {
                'abbreviation': row[3],
                'name': row[4],
                'lat': row[5],
                'long': row[6],
                'didok': row[7]
            }
        )
    return [value for value in line_dict.values()]
