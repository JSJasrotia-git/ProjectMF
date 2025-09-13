# This is just a sample program to try reading JSON data
import json
from datetime import date
# Set the directory where the file is available.
directory_path = "C:\\My Learning\\ProjectMF\\Data\\api_mfapi_in\\100027.json"
with open(directory_path, 'r') as f:
    json_data = json.load(f)

meta_info = json_data['meta']
nav_data = json_data['data']

print("Fund House:", meta_info['fund_house'])
print("Scheme Type:", meta_info['scheme_type'])
print("Scheme Category:", meta_info['scheme_category'])
#for entry in nav_data:
#   print(f"Date: {entry['date']}, NAV: {entry['nav']}")

meta_keys = list(meta_info.keys())
print(meta_keys)

print ("meta is ", type(meta_keys), " and data is ", type(nav_data))
print(nav_data[0].get("date"))
today = nav_data[0].get("date")[-4:]
curryear = int(date.today().year)
# today = 2024
if(int(curryear) > int(today)):
    print("The current year is greater", today)
else:
    print("The current year is equal to or less than given year")
print("the year is:", today)
print(nav_data[1].get("nav"))

