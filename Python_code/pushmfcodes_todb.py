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
    JSON_Data = data["MFDetails"]
    #keys = data.keys()

# Sort the JSON as per codes
sorted_data = sorted(JSON_Data, key=lambda x: x['schemeCode'])

lenofstring = 0
scheme_name = "test"

for record in JSON_Data:
    scheme_code = record['schemeCode']
    scheme_name = record['schemeName']
    isin_growth = record['isinGrowth']
    isin_div_reinvestment = record['isinDivReinvestment']
    cursor.execute('''
    INSERT INTO MFcodes (schemeCode, schemeName, isinGrowth, isinDivReinvestment )
    VALUES (%s, %s, %s, %s)
    ''', (scheme_code, scheme_name, isin_growth, isin_div_reinvestment)) 
# Commit the data

conn.commit()

# Step 5: Close the cursor and connection
cursor.close()
conn.close()
   #print(scheme_code, scheme_name, isin_growth, isin_div_reinvestment)
