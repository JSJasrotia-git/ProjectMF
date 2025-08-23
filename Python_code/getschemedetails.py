import json
import psycopg2
# Set the directory where the file is available.
directory_path = "C:\\My Learning\\ProjectMF\\Data\\api_mfapi_in\\100027.json"
with open(directory_path, 'r') as f:
    json_data = json.load(f)

meta_info = json_data['meta']
nav_data = json_data['data']

print("Fund House:", meta_info['fund_house'])
#for entry in nav_data:
#   print(f"Date: {entry['date']}, NAV: {entry['nav']}")

meta_keys = list(meta_info.keys())
print(meta_keys)

print ("meta is ", type(meta_keys), " and data is ", type(nav_data))
print(nav_data[0])
print(nav_data[1].get("nav"))
#print(type(nav_data[0]))
#print (nav_data.get("date"))
