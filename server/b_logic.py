import database as db



def all_mock_ops():
    
    """
    Fallback function for returning all the mock ops
    table_name: mock_ops
    schema: <id int, name text, lat real, long real>
    """
    
    #list of data that we receive from front end
    ldat_received = ('name', 'lat', 'long')
    
    
    # get the data
    #db_out = (db.get(mock_ops, ldat_received, filters = None))
    rows = db.get('mock_ops', ldat_received)
    return [{'name':row[0], 'lat':row[1], 'long':row[2]} for row in rows]
    
    # convert the data 
    # ret_list = []
    
    # for element in db_out:
    #     ret_list.append(
    #         {ldat_received[0]: element[0], 
    #          ldat_received[1]: element[1], 
    #          ldat_received[2]: element[2]})

    # return ret_list

#ldat_received = ['ID', 'abbreviation', 'name', 'lat', 'long', 'didok_id']

def all_lines():
    """dirty one for now"""
    rows = db.get('lines')
    line_dict = {row[0]: {'name': row[1], 'admin': row[2], 'ops':[]} for row in rows}
    
    sql = 'SELECT line_id, op_id, km, abbr, name, lat, long, didok FROM ops INNER JOIN line_plan ON ops.id = line_plan.op_id'

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
    return line_dict
