import psycopg2

# Step 1: Connect to the PostgreSQL database
conn = psycopg2.connect(
    dbname='projectmf',
    user='postgres',
    password='password',
    host='localhost',
    port='5432'  # default PostgreSQL port
)
cursor = conn.cursor()

# Step 2: Create MFcodes table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS MFcodes (
    schemeCode NUMERIC NOT NULL UNIQUE,
    schemeName VARCHAR(200),
    isinGrowth VARCHAR(20),
    isinDivReinvestment VARCHAR(20),
    startdate DATE,
    lastUpdated DATE,
    comment VARCHAR(200)
)
''')

# Step 4: Commit the transaction to save changes
conn.commit()

# Step 5: Close the cursor and connection
cursor.close()
conn.close()
