# This is a program to generate the MFcodes and MFDetails JSON files.

import psycopg2
from datetime import date, datetime
import json
import os
from decimal import Decimal
from psycopg2 import sql


# Step 1: Connect to PostgreSQL database and fetch table data
def gettabledata(query):
    conn = psycopg2.connect(
        dbname='projectmf',
        user='postgres',
        password='password',
        host='localhost',
        port='5432'  # default PostgreSQL port
    )
    cursor = conn.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


# Step 2: Convert rows to list of dicts and write JSON file
def writejsonfor_mfdetails(rows):
    filePath = "C:\\Project_Mf_Angular_Public_Data\\mfdetails.json"
    keys = ['schemecode', 'schemename', 'schemecategory']
    data = []
    for row in rows:
        row_dict = {}
        for key, value in zip(keys, row):
            if isinstance(value, (date, datetime)):
                row_dict[key] = value.isoformat()
            elif isinstance(value, Decimal):
                row_dict[key] = float(value)  # or str(value) if preferred
            else:
                row_dict[key] = value
        data.append(row_dict)
    
    output = {"mymfdata": data}
    
    with open(filePath, "w", encoding="utf-8") as file:
        json.dump(output, file, ensure_ascii=False, indent=2)


def createactivefundsjson(mfcode):
    filePath = "C:\\Project_Mf_Angular_Public_Data\\runtimejsonfiles\\" + mfcode + ".json"
    tablesqlquery = sql.SQL(
    'SELECT navdate, nav FROM {table} ORDER BY navdate DESC'
    ).format(table=sql.Identifier(mfcode))

    navanddate = gettabledata(tablesqlquery)

    keys = ['navdate', 'nav']
    
    data = []
    for row in navanddate:
        row_dict = {}
        for key, value in zip(keys, row):
            if isinstance(value, (date, datetime)):
                row_dict[key] = value.isoformat()
            elif isinstance(value, Decimal):
                row_dict[key] = float(value)  # or str(value) if preferred
            else:
                row_dict[key] = value
        data.append(row_dict)
    
    # output = {"mymfdata": data}
    
    with open(filePath, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
# Program execution starts here
# Adjust the query to whatever status you want to filter
sqlquery = "SELECT schemecode, schemename, schemecategory FROM MFcodes WHERE status = 'ACTIVE'"
sqlquery = """
SELECT schemecode, schemename, schemecategory, latestnavdate, latestnav
FROM MFcodes
WHERE status = 'ACTIVE'
ORDER BY fundhouse ASC, schemecategory ASC, schemename ASC
"""
# sqlquery = """
# SELECT schemecode
# FROM MFcodes
# WHERE status = 'ACTIVE'
# ORDER BY fundhouse ASC, schemecategory ASC, schemename ASC
# """
mfcodes = gettabledata(sqlquery)
writejsonfor_mfdetails(mfcodes)

# Create the navdate and price json for each of the fund
# mfactivenav = "SELECT schemeCode FROM MFcodes WHERE status = 'ACTIVE'" #Fetch fresh
# mfcodes = gettabledata(sqlquery)
# count = 0
# for row in mfcodes:
#     createactivefundsjson(str(row[0]))
#     # count+=1
#     # if(count>2):
#     #     break
# # To be done for all active tables data
