# Server Side of the SPC workflow
This aims at providing a short overview of the server side of the SPC workflow app.
## Requirements
The `server` is set up minimalistically in Python, relying mainly on flask.

If you have not done so, you must install the requirements by running
```shell
cd server
pip install requirements.txt
```

## Architecture
The backend consists of three layers:

1. Application (app.py)

   Serves as the entry point and re-routing of requests from the client.
2. Business Logic (b_logic.py)

   Sends the correct requests to the SQL server and formats the return value into the desired format.
3. SQL sever (database.py + data.db)

   The SQL server is implemented with a lightweight sqlite version. The database.py has a get method that allows
   simple retrieving of data from a table and the execution of individual SQL statements.

## Analyze
The analyze part is based on the following logic: 

1. For each construction site, find all the operating points (both personal trains and cargos) being affected. This is done by querying from both train service data and line operating points data. 
2. Use historical data to estimate the nominal capacity of the train services between operating points, and then use the reduction factor of the construction data to compute delays for the train services. 
3. Make operating points that has more than 3 minutes delay as problemaic sections. 
4. Compute accumulated delays for each line due to construction, and if this accumualates to more than 3 minutes, also mark this sector as (accumulated) problematic section. 
