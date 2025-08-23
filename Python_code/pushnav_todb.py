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
    cursor.execute('SELECT schemeCode FROM MFcodes where comment IS NULL')
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows
#End of function getmfcodes()
#+++++++++++++++++++++++++++++++++++++++++++

# Function to create table with dynamic table name
def create_table(table_name):
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
    cursor.execute(create_table_query)
    # Commit the changes
    conn.commit()
    # Close cursor and connection
    cursor.close()
    conn.close()
#End of function create_table(table_name)
#+++++++++++++++++++++++++++++++++++++++++++

# Function to create table with dynamic table name
def add_datatotable(table_name, file_name):
    with open(file_name, 'r') as f:
        try:
            json_data = json.load(f)
        except json.JSONDecodeError:
            return False
        
    #meta_info = json_data['meta']
    nav_data = json_data['data']
    print("file is: ", file_name)
    last_update = nav_data[0].get("date")
    start_date = nav_data[(len(nav_data) -1)].get("date")
    today_str = date.today().isoformat()
    comment_text = f"updated on: {today_str}"
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
        cursor.execute(insert_query, (line.get("date"), line.get("nav")))
        conn.commit()
    #Once all data is in close the connection within the function scope
    conn.commit()
    # add the start date and end date for the fund to mfcodes
    update_query = '''
        UPDATE mfcodes
        SET startdate = %s,
            lastupdated = %s,
            comment = %s
        WHERE schemecode = %s
    '''
    cursor.execute(update_query, (start_date, last_update, comment_text, table_name))
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
    create_table(table_name)
    # set the right file name
    file_path = "C:\\My Learning\\ProjectMF\\Data\\api_mfapi_in\\" +table_name+".json"
    #add data to the table
    if os.path.exists(file_path):
        add_datatotable(table_name, file_path)
    

#End of Program    







