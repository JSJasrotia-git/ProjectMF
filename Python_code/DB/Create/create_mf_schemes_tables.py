import psycopg2
import json

# Step 1: Connect to PostgreSQL database
conn = psycopg2.connect(
    dbname='projectmf',
    user='postgres',
    password='password',
    host='localhost',
    port='5432'  # default PostgreSQL port
)
cursor = conn.cursor()
# Step 2: Fetch multiple rows from the table
cursor.execute('SELECT schemeCode FROM MFcodes')
rows = cursor.fetchall()
cursor.close()
conn.close()

import psycopg2
from psycopg2 import sql

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

# Example usage
for row in rows:
    table_name = str(row[0]) 
    #create_table_sql = f"CREATE TABLE IF NOT EXISTS \"{table_name}\" (NAVDate DATE, NAV FLOAT)"
    create_table(table_name)

#End of Program    


