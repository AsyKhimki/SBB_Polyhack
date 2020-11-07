import database as db



def all_mock_ops():
    
    """
    Fallback function for returning all the mock ops
    """
    
    #list of data that we receive from front end
    #ldat_received = ['ID', 'abbreviation', 'name', 'lat', 'long', 'didok_id']
    ldat_received = ('name', 'lat', 'long')
    
    
    # get the data
    #db_out = (db.get(mock_ops, ldat_received, filters = None))
    rows = db.get(mock_ops, ldat_received)
    return [{'name':row[0], 'lat':row[1], 'long':row[2]} for row in rows]
    
    # convert the data 
    # ret_list = []
    
    # for element in db_out:
    #     ret_list.append(
    #         {ldat_received[0]: element[0], 
    #          ldat_received[1]: element[1], 
    #          ldat_received[2]: element[2]})

    # return ret_list




