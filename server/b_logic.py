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


def all_constructions():
    """dirty one for now"""
    rows = db.get('constr', ('id', 'region', 'project', 'comments', 'date_from', 'date_to', 'weeks', 'red_cap', 'type'))
    constr_dict = {row[0]: {'region': row[1], 'project': row[2], 'comments': row[3], 'date_from':row[4], 'date_to':row[5], 'num_weeks': row[6], 'cap_red': row[7], 'type': row[8], 'ops': []} for row in rows}
    sql = 'SELECT constr_id, abbr, name, lat, long, didok, sorting FROM ops INNER JOIN constr_ops ON ops.id = constr_ops.op_id ORDER BY constr_id, sorting;'

    rows = db.join_get(sql)
    for row in rows:
        constr_dict[row[0]]['ops'].append(
            {
                'abbreviation': row[1],
                'name': row[2],
                'lat': row[3],
                'long': row[4],
                'didok': row[5]
            }
        )
    return [value for value in constr_dict.values()]
    

def all_problem_zones():
    """dirty one for now"""
    rows = db.get('problem_zones', ('id', 'type', 'date_from', 'date_to'))
    problem_dict = {row[0]: {'type': row[1], 'date_from': row[2], 'date_to': row[3], 'ops': []} for row in rows}
    sql = 'SELECT problem_zone_id, op_id, abbr, name, lat, long, didok, sorting FROM ops INNER JOIN ops_problem_zones ON ops.id = ops_problem_zones.op_id ORDER BY problem_zone_id, sorting;'

    rows = db.join_get(sql)
    for row in rows:
        problem_dict[row[0]]['ops'].append(
            {
                'abbreviation': row[1],
                'name': row[2],
                'lat': row[3],
                'long': row[4],
                'didok': row[5]
            }
        )
    return [value for value in problem_dict.values()]
