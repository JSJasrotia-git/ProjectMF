#The code works but there may be an issue of imports tand Virtual environment.

import psycopg2
from datetime import datetime

# Step 1: Connect to PostgreSQL database
def gettabledata(query):
    conn = psycopg2.connect(
        dbname='projectmf',
        user='postgres',
        password='password',
        host='localhost',
        port='5432'  # default PostgreSQL port
    )
    cursor = conn.cursor()
    # Step 2: Fetch multiple rows from the table
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows
#End of function getmfcodes()
#+++++++++++++++++++++++++++++++++++++++++++

def writejson(jsondatatowrite, filename):
    # # Convert PostgreSQL rows into list of dicts
    filePath = "C:\\Project_Mf_Angular_Public_Data\\"
    datatowrite = "["
    for row in jsondatatowrite:
        json_list_string = (str(row[0])).replace("nav date ",'')
        converted_date = datetime.strptime(json_list_string, "%Y-%m-%d")
        json_list_string = converted_date.strftime("%d-%m-%Y")
        datatowrite = datatowrite + '{"date":"' + str(json_list_string) + '","nav":"' + str(row[1]) + '"},'     
    datatowrite = datatowrite[:-1] + ']'
    # Open the file in write mode at the specified path and write the string
    with open(filePath + filename + ".json", "w") as file:
        file.write(datatowrite)
#End of function getmfcodes()
#+++++++++++++++++++++++++++++++++++++++++++

#Program Execution starts from here.
sqlquery = "SELECT schemeCode FROM MFcodes"
mfcodes = gettabledata(sqlquery)
for row in mfcodes:
    table_name = str(row[0])    # Create a table if it does not exist.
    sqlquery = 'SELECT * FROM "' + table_name + '"'
    jsondatatowrite = gettabledata(sqlquery)
    writejson(jsondatatowrite, table_name)
#End of Program    

















# # Connect to your PostgreSQL database
# conn = psycopg2.connect(
#     dbname="your_database",
#     user="your_username",
#     password="your_password",
#     host="your_host",
#     port="your_port"
# )
# cur = conn.cursor()

# # Query all data from your table
# cur.execute("SELECT * FROM your_table_name")  # replace with your table
# columns = [desc for desc in cur.description]
# rows = cur.fetchall()

# # Convert PostgreSQL rows into list of dicts
# table_data = [dict(zip(columns, row)) for row in rows]

# # Save as JSON
# with open("table_data.json", "w", encoding="utf-8") as f:
#     json.dump(table_data, f, ensure_ascii=False, indent=2)

# cur.close()
# conn.close()
