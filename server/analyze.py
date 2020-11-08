import numpy as np
import pandas as pd 
import json
import sqlite3
from pathlib import Path
FILE = Path('.') / 'server' / 'data.db'
import database as db

def all_constructions():
    """dirty one for now"""
    rows = db.get('constr', ('id', 'region', 'project', 'comments', 'date_from', 'date_to', 'weeks', 'red_cap', 'type'))
    constr_dict = {row[0]: {'region': row[1], 'project': row[2], 'date_from':row[4], 'date_to':row[5], 'cap_red': row[7], 'type': row[8], 'op_from': '', 'op_to': '', 'op_from_id':'', 'op_to_id':''} for row in rows}
    sql = 'SELECT constr_id, abbr, name, lat, long, didok, sorting, op_id FROM ops INNER JOIN constr_ops ON ops.id = constr_ops.op_id ORDER BY constr_id, sorting;'

    rows = db.join_get(sql)
    for row in rows:
        if row[6] == 0:
            constr_dict[row[0]]['op_from'] = row[1]
            constr_dict[row[0]]['op_from_id'] = row[7]
        else:
            constr_dict[row[0]]['op_to'] = row[1]
            constr_dict[row[0]]['op_to_id'] = row[7]
    return [value for value in constr_dict.values()]

def all_bp_von():
    return db.get('capacities', ('id', 'direction', 'train_type', 'train_number', 'op_from_id', 'op_to_id'))

def query_bp_von(constructionFromId):
    sql = f'SELECT id, direction, train_type, train_number, op_from_id, op_to_id FROM capacities WHERE op_from_id = {constructionFromId}'
    rows = db.join_get(sql)
    return rows

def query_lines(constructionFromId, constructionToId):
    sql = f'SELECT line_id FROM line_plan WHERE op_id= {constructionFromId} '
    rows1 = db.join_get(sql)
    sql = f'SELECT line_id  FROM line_plan WHERE op_id= {constructionToId} '
    rows2 = db.join_get(sql)
    intersectionSet = set(rows1).intersection(set(rows2))
    if intersectionSet:
        return list(intersectionSet)[0][0]
    else:
        return None

def query_op_on_lines(lineID):
    sql = f'SELECT op_id FROM line_plan WHERE line_id = {lineID} ORDER BY km'
    rows1 = db.join_get(sql)
    return rows1

# initial query
constructionInfoList = all_constructions()

# result is a list of four tuple, indicating from which station to which station (also within a time period) are problematic due to construction work
# (id_from, id_to, time_start, time_finish)
problemStationPairListPerson = []
problemStationPairListGood = []
problemStationPairListUmsetzung = []

for constructionInfo in constructionInfoList:
    constructionFrom = constructionInfo['op_from_id']
    constructionTo = constructionInfo['op_to_id']
    constructionTimeFrom = constructionInfo['date_from']
    constructionTimeTo = constructionInfo['date_to']
    constructionPeriod = constructionInfo['type']
    reducedCapacity = constructionInfo['cap_red']

    dPerson = {}
    dGood = {}
    dUmsetzung = {}

    # ignored cases
    if constructionPeriod is None: continue
    # leave 'Umsetzung' for now
    if constructionPeriod == 'Umleitung':
        continue

    capacityInfoList = query_bp_von(constructionFrom)
    if not capacityInfoList: continue

    # Umsetzung
    if constructionPeriod == 'Umsetzung':
        for capacityInfo in capacityInfoList:
            if (constructionFrom ,capacityInfo[-1]) not in dUmsetzung:
                dUmsetzung[(constructionFrom ,capacityInfo[-1])] = capacityInfo[3]
            else:
                dUmsetzung[(constructionFrom ,capacityInfo[-1])] += capacityInfo[3]
        # check align here
        # find lines that the construction goes through
        lineID = query_lines(constructionFrom, constructionTo)
        if lineID is None:
            continue
        # check if dictionary values are aligned, if not, delete corresponding entries
        allStationsOnLine = query_op_on_lines(lineID)
        index1 = allStationsOnLine.index((constructionFrom,))
        index2 = allStationsOnLine.index((constructionTo,))
        for key in list(dUmsetzung):
            if (key[1],) not in allStationsOnLine[index1:index2]:
                del dUmsetzung[key]
        # no need computation
        for key in list(dUmsetzung):
            problemStationPairListUmsetzung.append((key[0],key[1],constructionTimeFrom,constructionTimeTo))
        continue

    # Good 
    for capacityInfo in capacityInfoList:
        if (constructionFrom ,capacityInfo[-1]) not in dGood:
            dGood[(constructionFrom ,capacityInfo[-1])] = capacityInfo[3]
        else:
            dGood[(constructionFrom ,capacityInfo[-1])] += capacityInfo[3]
    # check align here
    # find lines that the construction goes through
    lineID = query_lines(constructionFrom, constructionTo)
    if lineID is None:
        continue
    # check if dictionary values are aligned, if not, delete corresponding entries
    allStationsOnLine = query_op_on_lines(lineID)
    index1 = allStationsOnLine.index((constructionFrom,))
    index2 = allStationsOnLine.index((constructionTo,))
    for key in list(dGood):
        if (key[1],) not in allStationsOnLine[index1:index2]:
            del dGood[key]
    # computation
    for key in list(dGood):
        oldCap = dGood[key]/(365*24)
        try:
            newCap = oldCap * (1-reducedCapacity)
        except:
            break
        if newCap == 0:
            problemStationPairListGood.append((key[0],key[1],constructionTimeFrom,constructionTimeTo))
            continue
        delayTime = (1/newCap - 1/oldCap) * 60
        if delayTime >= 3:
            problemStationPairListGood.append((key[0],key[1],constructionTimeFrom,constructionTimeTo))
        
    # MODIFICATION BY MAXIM
    # make the list empty as you count for it in the second list
    problemStationPairListGood = []
            
    # person train
    if ('24' in constructionPeriod or 'Tag' in constructionPeriod):
        for capacityInfo in capacityInfoList:
            if (constructionFrom ,capacityInfo[-1]) not in dPerson:
                dPerson[(constructionFrom ,capacityInfo[-1])] = capacityInfo[3]
            else:
                dPerson[(constructionFrom ,capacityInfo[-1])] += capacityInfo[3]
        # check align here
        # find lines that the construction goes through
        lineID = query_lines(constructionFrom, constructionTo)
        if lineID is None:
            continue
        # check if dictionary values are aligned, if not, delete corresponding entries
        allStationsOnLine = query_op_on_lines(lineID)
        index1 = allStationsOnLine.index((constructionFrom,))
        index2 = allStationsOnLine.index((constructionTo,))
        for key in list(dPerson):
            if (key[1],) not in allStationsOnLine[index1:index2]:
                del dPerson[key]
        # computation
        for key in list(dPerson):
             #oldCap = dPerson[key]/(365*18)
            
            # MODIFICATION BY MAXIM
            oldCap += dPerson[key]/(365*18)
            
            newCap = oldCap * (1-reducedCapacity)
            if newCap == 0:
                problemStationPairListPerson.append((key[0],key[1],constructionTimeFrom,constructionTimeTo))
                continue
            delayTime = (1/newCap - 1/oldCap) * 60
            if delayTime >= 3:
                problemStationPairListPerson.append((key[0],key[1],constructionTimeFrom,constructionTimeTo))

# print(len(problemStationPairListPerson))
# print(len(problemStationPairListGood))
# print(len(problemStationPairListUmsetzung))
def insert_problem_zones(cursor, type, problem_zones, pz_id, pz_ops_id):
    pz_tbl = []
    pz_ops_tbl = []
    for problem_zone in problem_zones:
        pz_tbl.append((pz_id, type, problem_zone[2], problem_zone[3]))
        pz_ops_tbl.append((pz_ops_id, pz_id, problem_zone[0], 0))
        pz_ops_id += 1
        pz_ops_tbl.append((pz_ops_id, pz_id, problem_zone[1], 1))
        pz_ops_id += 1
        pz_id += 1
    sql = 'INSERT INTO problem_zones (id, type, date_from, date_to) VALUES (?, ?, ?, ?);'
    cursor.executemany(sql, pz_tbl)
    sql = 'INSERT INTO ops_problem_zones (id, problem_zone_id, op_id, sorting) VALUES (?, ?, ?, ?);'
    cursor.executemany(sql, pz_ops_tbl)
    return pz_id, pz_ops_id

        
# Add it to the database to temporary tables
with db.DatabaseCursor(FILE) as cursor:
    sql = "DROP TABLE IF EXISTS problem_zones;"
    cursor.execute(sql)
    sql =  "DROP TABLE IF EXISTS ops_problem_zones;"
    cursor.execute(sql)
    sql = ("CREATE TABLE problem_zones (id INT PRIMARY KEY, "
            "type TEXT, date_from datetime, date_to datetime)")
    cursor.execute(sql)
    sql = ("CREATE TABLE ops_problem_zones (id INT PRIMARY KEY, "
           "problem_zone_id INT, op_id INT, sorting INT)")
    cursor.execute(sql)
    pz_id, pz_ops_id = insert_problem_zones(cursor, 'Personenwagen', problemStationPairListPerson, 0, 0)
    pz_id, pz_ops_id = insert_problem_zones(cursor, 'Umsetzung', problemStationPairListUmsetzung, pz_id, pz_ops_id)
    
