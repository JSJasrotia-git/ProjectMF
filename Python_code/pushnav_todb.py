#Program to push NAV to tables and update mfcodes for values.

import psycopg2
import json
from datetime import date
from psycopg2 import sql
import os

# Step 1: Connect to PostgreSQL database
def getmfcodes():
    conn = psycopg2.connect(
        dbname='projectmf',
        user='postgres',
        password='password',
        host='localhost',
        port='5432'  # default PostgreSQL port
    )
    cursor = conn.cursor()
    # Step 2: Fetch multiple rows from the table
    #may have to update the below query as we update DB.
    cursor.execute('SELECT schemeCode FROM MFcodes where status IS NULL') 
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows
#End of function getmfcodes()
#+++++++++++++++++++++++++++++++++++++++++++

# Function to create table with dynamic table name
def dropandcreate_table(table_name):
    drop_table_query = sql.SQL('DROP TABLE IF EXISTS {table}').format(table=sql.Identifier(table_name))
    
    create_table_query = sql.SQL('''
    CREATE TABLE IF NOT EXISTS {table} (
        NAVDate DATE NOT NULL UNIQUE,
        NAV FLOAT
    );
    ''').format(table=sql.Identifier(table_name))
    
    # Connect to PostgreSQL
    conn = psycopg2.connect(
        dbname='projectmf',
        user='postgres',
        password='password',
        host='localhost',
        port='5432'  # default PostgreSQL port
    )
    cursor = conn.cursor()

    # Execute the CREATE TABLE query
    cursor.execute(drop_table_query)
    conn.commit() #commit the table drop.
    cursor.execute(create_table_query)
    # Commit the changes
    conn.commit()
    # Close cursor and connection
    cursor.close()
    conn.close()
#End of function drop and recreate _table(table_name)
#+++++++++++++++++++++++++++++++++++++++++++

# Function to create table with dynamic table name
def add_datatotable(table_name, file_name):
    with open(file_name, 'r') as f:
        try:
            json_data = json.load(f)
        except json.JSONDecodeError:
            return False
        
    meta_info = json_data['meta']
    nav_data = json_data['data']
    print("file is: ", file_name)
    #Field to update in mfcodes:latestnavdate
    last_update = nav_data[0].get('date')
    last_nav = nav_data[0].get('nav')
    start_date = nav_data[(len(nav_data) -1)].get('date')
    #Check if the year is this year
    if((int(date.today().year)) == (int((nav_data[0].get('date'))[-4:]))):
        _schemestatus = 'ACTIVE'
    else:
        _schemestatus = 'SUSPENDED'
    
    _fundhouse = meta_info['fund_house']
    _schemetype = meta_info['scheme_type']
    _schemecategory = meta_info['scheme_category']
    #Field to update in mfcodes:schemestartdate
    #today_str = date.today().isoformat()
    #comment_text = f"updated on: {today_str}"
    # Open SQL connection
        # Connect to PostgreSQL
    conn = psycopg2.connect(
        dbname='projectmf',
        user='postgres',
        password='password',
        host='localhost',
        port='5432'  # default PostgreSQL port
    )
    cursor = conn.cursor()
    for line in nav_data:
        insert_query = sql.SQL('''
        INSERT INTO {table} (navdate, nav)
        VALUES (%s, %s)
        ''').format(table=sql.Identifier(table_name))
        cursor.execute(insert_query, (line.get('date'), line.get('nav')))
        conn.commit()
    #Once all data is in close the connection within the function scope
    conn.commit()
    # add the start date and end date for the fund to mfcodes
    update_query = '''
        UPDATE mfcodes
        SET fundhouse = %s,
            schemetype = %s,
            schemecategory = %s,
            latestnavdate = %s,
            schemestartdate = %s,
            latestnav = %s,
            status = %s
        WHERE schemecode = %s
    '''
    cursor.execute(update_query, (_fundhouse, _schemetype, _schemecategory, last_update, start_date, last_nav, _schemestatus, table_name))
    conn.commit()
    cursor.close()
    conn.close()
#End of function create_table(table_name)

#Program Execution starts from here.
mfcodes = getmfcodes()
count = 0
for row in mfcodes:
    table_name = str(row[0]) 
    # Create a table if it does not exist.
    dropandcreate_table(table_name)
    # set the right file name
    file_path = "C:\\My Learning\\ProjectMF\\Data\\api_mfapi_in\\" +table_name+".json"
    #add data to the table
    # print("checking for file", file_path)
    if os.path.exists(file_path):
        # print("file path exists")
        add_datatotable(table_name, file_path)
    # count +=1
    # if(count>10):
    #     break

#End of Program    







