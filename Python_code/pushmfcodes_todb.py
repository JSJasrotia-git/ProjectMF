import json
import psycopg2
# Set the directory where the file is available.
directory_path = "C:\\My Learning\\ProjectMF\\Data\\api_mfapi_in\\apimfapii.json"
#open DB connections
conn = psycopg2.connect(
    dbname='projectmf',
    user='postgres',
    password='password',
    host='localhost',
    port='5432'  # default PostgreSQL port
)
cursor = conn.cursor()

with open(directory_path, 'r') as f:
    data = json.load(f)

lenofstring = 0
scheme_name = "test"

for record in data:
    scheme_code = record['schemeCode']
    scheme_name = record['schemeName']
    cursor.execute('''
    INSERT INTO MFcodes (schemeCode, schemeName)
    VALUES (%s, %s)
    ''', (scheme_code, scheme_name)) 

# Commit the data
conn.commit()
# Step 5: Close the cursor and connection
cursor.close()
conn.close()

