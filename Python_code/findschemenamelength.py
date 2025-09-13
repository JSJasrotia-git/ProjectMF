# Program to find the max length of the schemen name. 
# This helps in desigining the DB column name
# The finding are that the length of schemename has been at max 181 characters. 
# Taking a buffer and designing field for 250 chars.
import json
# Set the directory where the file is available.
directory_path = "C:\\My Learning\\ProjectMF\\Data\\api_mfapi_in\\apimfapii.json"

with open(directory_path, 'r') as f:
    data = json.load(f)

scheme_name = "test"
_len = 0
for record in data:
    if(len(record['schemeName']) > _len):
        _len = len(record['schemeName'])
        scheme_name = record['schemeName']
 
print("The scheme name and length are:", _len, scheme_name)
