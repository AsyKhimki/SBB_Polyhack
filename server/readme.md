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
