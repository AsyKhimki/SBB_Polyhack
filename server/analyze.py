import numpy as np
import pandas as pd 
import json
import sqlite3

def analyse_construction_site(constructionSiteEntry):
    # load parameters
    constructionFrom = constructionSiteEntry.bp_from
    constructionTo = constructionSiteEntry.bp_to
    constructionTimeFrom = constructionSiteEntry.date_from
    constructionTimeTo = constructionSiteEntry.date_to
    constructionPeriod = constructionSiteEntry.umsetzung_intervalltyp_umleitung # {24, Tag, Nacht, Umsetzung}
    reducedCapacity = constructionSiteEntry.reduction_capacity

    stationParisAffectedPerson, stationParisAffectedFreight = find_station_pairs_affected(constructionFrom, constructionTo)

    problemmaticStationPairsPerson = []
    if constructionPeriod in set('24', 'Tag'):
        for stationPair in stationParisAffectedPerson:
            oldCapacity = stationPair.trainNumPerHour
            newCapacity = oldCapacity * reducedCapacity
            delayTime = (1/newCapacity - 1/oldCapacity) * 60
            if delayTime >= 3:
                problemmaticStationPairsPerson.append(stationPair)
    
    problemmaticStationPairsFreight = []
    for stationPair in stationParisAffectedFreight:
        oldCapacity = stationPair.trainNumPerHour
        newCapacity = oldCapacity * reducedCapacity
        delayTime = (1/newCapacity - 1/oldCapacity) * 60
        if delayTime >= 3:
            problemmaticStationPairsFreight.append(stationPair)

    # problemmaticStationPairsUndefined = []
    # if constructionPeriod is 'Umsetzung':
    #     problemmaticStationPairsUndefined = copy.deepcopy(stationParisAffectedPerson)

    return problemmaticStationPairsPerson, problemmaticStationPairsFreight, constructionTimeFrom, constructionTimeTo
    

def find_station_pairs_affected(constructionFrom, constructionTo):
    stationParisAffectedPerson = []
    stationParisAffectedFreight = []
    trainNumPerson = 0
    trainNumFreight = 0
    # query zugzahlen database from, in this case, constructionFrom == zugzahlenEntry.start
    zugzahlenEntryList = queryZugzahlenFrom(constructionFrom)
    for zugzahlenEntry in zugzahlenEntryList:
        if checkAllign(constructionFrom, constructionTo, zugzahlenEntry.destination):
            if zugzahlenEntry.type == 'Person':
                trainNumPerson += zugzahlenEntry.trainNumber
            elif zugzahlenEntry.type == 'Freight'
                trainNumFreight += zugzahlenEntry.trainNumber
    stationParisAffectedPerson.append([constructionFrom, zugzahlenEntry.destination, trainNumPerson/(365*18)])
    stationParisAffectedFreight.append([constructionFrom, zugzahlenEntry.destination, trainNumFreight/(365*24)])
    return stationParisAffectedPerson, stationParisAffectedFreight

def checkAllign(constructionFrom, constructionTo, zugzahlenTo):
    # query the Linie database
    lines = queryLines(constructionFrom, constructionTo) # find all the lines pass through constructionFrom and constructionTo
    for line in lines:
        if zugzahlenTo in line.operatingPointsAfterConstructionFromAtDirectionOfConstructionTo:
            return True
    return False 
